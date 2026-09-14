import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from "../lib/firebase";

export function useFirestoreCollection<T extends { id: string; order?: number }>(
  collectionName: string,
  defaultItems: T[]
) {
  const localKey = `portfolio_cms_${collectionName}`;
  const [items, setItems] = useState<T[]>(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultItems;
      }
    }
    return defaultItems;
  });
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for custom cross-component and local storage updates
    const handleLocalUpdate = () => {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
          setItems(parsed);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("portfolio_content_updated", handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);

    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return () => {
        window.removeEventListener("portfolio_content_updated", handleLocalUpdate);
        window.removeEventListener("storage", handleLocalUpdate);
      };
    }

    try {
      const q = query(collection(db, collectionName));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            // Fallback to local / default items if collection is empty in Firestore
            const saved = localStorage.getItem(localKey);
            if (saved) {
              try {
                setItems(JSON.parse(saved));
              } catch {
                setItems(defaultItems);
              }
            } else {
              setItems(defaultItems);
            }
          } else {
            const list: T[] = [];
            snapshot.forEach((docSnap) => {
              list.push({ id: docSnap.id, ...(docSnap.data() as object) } as T);
            });
            list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setItems(list);
            localStorage.setItem(localKey, JSON.stringify(list));
          }
          setLoading(false);
        },
        (err) => {
          console.warn(`Firestore collection listener for ${collectionName} failed:`, err);
          setError(err.message);
          // Fall back gracefully
          setItems((prev) => (prev.length > 0 ? prev : defaultItems));
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
        window.removeEventListener("portfolio_content_updated", handleLocalUpdate);
        window.removeEventListener("storage", handleLocalUpdate);
      };
    } catch (e) {
      console.warn(`Error setting up listener for ${collectionName}:`, e);
      setLoading(false);
      return () => {
        window.removeEventListener("portfolio_content_updated", handleLocalUpdate);
        window.removeEventListener("storage", handleLocalUpdate);
      };
    }
  }, [collectionName, localKey]);

  // Synchronize local storage when in local/demo mode or on changes
  const updateLocal = (newItems: T[]) => {
    setItems(newItems);
    localStorage.setItem(localKey, JSON.stringify(newItems));
    // Dispatch custom storage event so other components/tabs re-render immediately
    window.dispatchEvent(new Event("portfolio_content_updated"));
  };

  const addItem = async (itemData: Omit<T, "id"> & { id?: string }) => {
    const newId = itemData.id || `${collectionName.slice(0, 4)}-${Date.now()}`;
    const newItem = { ...itemData, id: newId } as T;
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, newId), newItem as DocumentData);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `${collectionName}/${newId}`);
      }
    }
    const updated = [...items, newItem].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    updateLocal(updated);
    return newItem;
  };

  const updateItem = async (id: string, partial: Partial<T>) => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, id), partial as DocumentData, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${id}`);
      }
    }
    const updated = items.map((item) =>
      item.id === id ? { ...item, ...partial } : item
    ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    updateLocal(updated);
  };

  const deleteItem = async (id: string) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${id}`);
      }
    }
    const updated = items.filter((item) => item.id !== id);
    updateLocal(updated);
  };

  const reorderItems = async (newOrderedItems: T[]) => {
    const normalized = newOrderedItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
    if (isFirebaseConfigured && db) {
      for (const item of normalized) {
        try {
          await setDoc(doc(db, collectionName, item.id), { order: item.order } as DocumentData, { merge: true });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${item.id}`);
        }
      }
    }
    updateLocal(normalized);
  };

  const resetToDefault = async () => {
    if (isFirebaseConfigured && db) {
      try {
        const batch = writeBatch(db);
        const existing = await getDocs(collection(db, collectionName));
        existing.forEach((snapshot) => batch.delete(snapshot.ref));
        defaultItems.forEach((item) => {
          batch.set(doc(db, collectionName, item.id), item as DocumentData);
        });
        await batch.commit();
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, collectionName);
      }
    }

    updateLocal(defaultItems);
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    resetToDefault,
  };
}
