<template>
  <div :class="$style.row">
    <div :class="$style.columnleft">
      <input
        v-model="newText"
        placeholder="Search or Add..."
        :class="$style.input"
        @keyup="search"
        @keyup.esc="clear"
        @keyup.enter="add" />
    </div>
    <div :class="$style.columnright">
      <div :class="$style.radio">
        <input
          type="image"
          :src="require('./assets/add.svg')"
          class="btn"
          :class="
            newText.length === 0 || exactMatchIds.length !== 0
              ? 'btn-disabled'
              : 'btn-enabled'
          "
          :disabled="newText.length === 0 || exactMatchIds.length !== 0"
          @click="add" />
        <br />
        <input id="byName" v-model="sortType" type="radio" :value="1" />
        <label>Sort By Value</label>
        <br />
        <input id="byDate" v-model="sortType" type="radio" :value="2" />
        <label>Sort By Added Date</label>
      </div>
    </div>
  </div>

  <div class="data">
    <DataCard
      v-for="item in dataSearched"
      :key="item.id"
      :item="item"
      :is-found="item.isExactMatch"
      @item-remove="remove"
      @mouseover="item.hasRemoveButton = true"
      @mouseout="item.hasRemoveButton = false" />
  </div>
</template>

<script lang="ts">
import DataCard from './components/DataCard.vue';
import { computed, defineComponent, ref, watch } from 'vue';
import {
  DataCardItem,
  SortingType,
  LoadStorage,
  SaveStorage,
  AddToStorage,
  RemoveFromStorage,
} from './components/DataCard';
import { formatDistance } from 'date-fns';

export const localStorageKey = 'items';

export default defineComponent({
  name: 'App',
  components: {
    DataCard,
  },
  emits: ['itemRemove'],

  setup() {
    const dataSource = ref(LoadStorage());
    const newText = ref('');
    const sortType = ref(SortingType.Name);

    const dataSearched = computed(() => {
      var sortedItems = [] as DataCardItem[];
      sortedItems = dataSource.value.filter((x) => {
        if (exactMatchIds.value.includes(x.id)) {
          x.isExactMatch = true;
        } else {
          x.isExactMatch = false;
        }
        return x.name.toLowerCase().includes(newText.value.toLowerCase());
      });
      if (sortType.value === SortingType.Name) {
        sortedItems = sortedItems.sort((a, b) => {
          const na = a.name.toLowerCase(),
            nb = b.name.toLowerCase();
          if (na < nb) {
            return -1;
          }
          if (na > nb) {
            return 1;
          }
          return 0;
        });
      } else {
        sortedItems = sortedItems.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        });
      }
      return sortedItems;
    });

    const exactMatchIds = computed(() => {
      return dataSource.value
        .filter(({ name }) => {
          return name.toLowerCase() === newText.value.toLowerCase();
        })
        .map(({ id }) => {
          return id;
        });
    });

    watch(
      dataSource,
      (data) => {
        if (data.length) SaveStorage(data);
        else LoadStorage();
      },
      { deep: true }
    );

    return {
      dataSource,
      dataSearched,
      newText,
      sortType,
      exactMatchIds,
    };
  },

  methods: {
    add() {
      AddToStorage(this.newText);
      this.newText = '';
      this.dataSource = LoadStorage();
    },

    remove(id: number) {
      RemoveFromStorage(id);
      this.dataSource = LoadStorage();
    },

    clear() {
      this.newText = '';
    },

    dateDistance(date: Date): string {
      var res = formatDistance(date, new Date(), { addSuffix: true });
      return res;
    },
  },
});
</script>

<style scoped>
@import './sass/global.scss';
</style>

<style lang="scss" module>
@use 'sass/color';

// Style
.input {
  width: 100%;
  padding: 20px;
  outline: transparent;
  background: color.$inputbox-background;
  border: 1px solid;
  margin-top: 15px;
  margin-left: 50px;
  margin-bottom: 10px;
  margin-right: 50px;
  border-radius: 5px;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.columnleft {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
}

.columnright {
  flex-direction: column;
  width: 350px;
  margin-left: 50px;
}

.radio {
  align-items: right;
  padding: 10px;
  margin-left: 0px;
}
</style>
