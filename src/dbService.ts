import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "./firebase";
import { setDoc, writeBatch } from "firebase/firestore";
import { InventoryItem } from "./types";
import { INITIAL_INVENTORY_ITEMS } from "./initialData";

const COLLECTION_NAME = "inventory";

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("Database is empty, seeding initial high-quality items...");
      // Let's batch set the initial items to Firestore.
      const batch = writeBatch(db);
      for (const initItem of INITIAL_INVENTORY_ITEMS) {
        const itemDocRef = doc(db, COLLECTION_NAME, initItem.id);
        const { ...itemData } = initItem;
        const savePayload = {
          ...itemData,
          created_at: new Date().toISOString() // Use ISO string for cross-compatibility
        };
        batch.set(itemDocRef, savePayload);
      }
      await batch.commit();
      
      // Fetch again to return the seeded items
      const newSnapshot = await getDocs(q);
      const items: InventoryItem[] = [];
      newSnapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          ...data
        } as InventoryItem);
      });
      // Sort items by created_at descending
      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const items: InventoryItem[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      items.push({
        id: d.id,
        ...data
      } as InventoryItem);
    });
    
    // Sort items by created_at descending
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error("Error fetching inventory from Firestore:", error);
    // Return fallback initial data if there is an offline or auth permission issue during boot
    return INITIAL_INVENTORY_ITEMS;
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, "id" | "created_at">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const payload = {
    ...item,
    created_at: new Date().toISOString()
  };
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  // Remove id and created_at to avoid overwriting them
  const { id: _, created_at: __, ...data } = updates;
  await updateDoc(docRef, data);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
