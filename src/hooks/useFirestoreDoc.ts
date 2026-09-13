import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from "../lib/firebase";

export function useFirestoreDoc<T extends object>(
  collectionName: string,
  docId: string,
  defaultData: T
) {
  const localKey = `portfolio_cms_${collectionName}_${docId}`;
  const [data, setData] = useState<T>(() => {
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for custom cross-component update events
    const handleCustomUpdate = () => {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("portfolio_content_updated", handleCustomUpdate);

    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return () => {
        window.removeEventListener("portfolio_content_updated", handleCustomUpdate);
      };
    }

    try {
      const docRef = doc(db, collectionName, docId);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const fetched = docSnap.data() as T;
            setData(fetched);
            localStorage.setItem(localKey, JSON.stringify(fetched));
          } else {
            // Document doesn't exist yet on remote, keep local/default
            const saved = localStorage.getItem(localKey);
            if (saved) {
              try {
                setData(JSON.parse(saved));
              } catch {
                setData(defaultData);
              }
            } else {
              setData(defaultData);
            }
          }
          setLoading(false);
        },
        (err) => {
          console.warn(`Firestore doc listener for ${collectionName}/${docId} failed:`, err);
          setError(err.message);
          setData((prev) => prev || defaultData);
          setLoading(false);
          handleFirestoreError(err, OperationType.GET, `${collectionName}/${docId}`);
        }
      );

      return () => {
        unsubscribe();
        window.removeEventListener("portfolio_content_updated", handleCustomUpdate);
      };
    } catch (e) {
      console.warn(`Error setting up doc listener for ${collectionName}/${docId}:`, e);
      setLoading(false);
      return () => {
        window.removeEventListener("portfolio_content_updated", handleCustomUpdate);
      };
    }
  }, [collectionName, docId]);

  const updateDocData = async (partial: Partial<T>) => {
    const updated = { ...data, ...partial } as T;

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, collectionName, docId), partial as DocumentData, { merge: true });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${docId}`);
      }
    }

    setData(updated);
    localStorage.setItem(localKey, JSON.stringify(updated));
    window.dispatchEvent(new Event("portfolio_content_updated"));
  };

  const resetToDefault = () => {
    setData(defaultData);
    localStorage.setItem(localKey, JSON.stringify(defaultData));
    window.dispatchEvent(new Event("portfolio_content_updated"));
  };

  return {
    data,
    loading,
    error,
    updateDocData,
    resetToDefault,
  };
}
