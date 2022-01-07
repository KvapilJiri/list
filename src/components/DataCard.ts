export interface DataCardItem {
  id: number;
  name: string;
  date: Date;
  time: string;
  hasRemoveButton: boolean;
  isExactMatch: boolean;
}

export interface DataCardStorageItem {
  id: number;
  name: string;
  date: string;
}

export enum SortingType {
  Name = 1,
  Date = 2,
}

export const localStorageKey = 'items';

export function LoadStorage(): DataCardItem[] {
  const storageJson = localStorage.getItem(localStorageKey);
  const items = new Array<DataCardItem>();

  if (storageJson !== null) {
    try {
      let storageItems = new Array<DataCardStorageItem>();
      storageItems = JSON.parse(storageJson);
      let i = 1;
      storageItems.forEach((element) => {
        const item = {} as DataCardItem;
        item.id = i++;
        item.name = element.name;
        item.date = new Date(element.date);
        items.push(item);
      });
    } catch (e) {
      localStorage.removeItem(localStorageKey);
    }
  }
  return items;
}

export function SaveStorage(StorageItems: DataCardItem[]): any {
  const storageItems = new Array<DataCardStorageItem>();

  (StorageItems as DataCardItem[]).forEach((element) => {
    const item = {} as DataCardStorageItem;
    item.id = element.id;
    item.name = element.name;
    item.date = element.date.toISOString();
    storageItems.push(item);
  });

  localStorage.removeItem(localStorageKey);
  localStorage.setItem(localStorageKey, JSON.stringify(storageItems));
}

export function AddToStorage(NewText: string): any {
  const item = {} as DataCardItem;
  const StorageItems = LoadStorage();

  item.id = StorageItems.length + 1;
  item.name = NewText;
  item.date = new Date();
  item.time = '';
  item.hasRemoveButton = false;
  item.isExactMatch = false;

  StorageItems.push(item);

  SaveStorage(StorageItems);
}

export function RemoveFromStorage(id: number): any {
  let ind = 0;
  const StorageItems = LoadStorage();

  (StorageItems as DataCardItem[]).forEach((item) => {
    const found = item.id === id;
    if (found) {
      StorageItems.splice(ind, 1);
      return;
    }
    ind++;
  });
  // Reindex
  ind = 1;
  (StorageItems as DataCardItem[]).forEach((item) => {
    item.id = ind++;
  });

  SaveStorage(StorageItems);
}
