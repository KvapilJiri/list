<template>
  <div :class="getClass(item.hasRemoveButton)">
    <div :class="$style.row">
      <div v-show="item.isFound" class="item-found">
        <img :src="require('../assets/check.svg')" alt="check" />
      </div>
      <div :class="$style.column">
        <span>
          <b>{{ item.name }}</b>
        </span>
        <span>Id: {{ item.id }}</span>
        <span v-show="isFound" :class="$style.itemfound"
          ><i>Exact match</i></span
        >
      </div>
      <span>{{ dateDistanceLocal(item.date) }}</span>
      <div :class="$style.rowbuttons">
        <input
          v-show="item.hasRemoveButton"
          id="btn-cancel"
          type="image"
          class="btn btn-red"
          :src="require('../assets/trash.svg')"
          @click="$emit('itemRemove', item.id)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, useCssModule } from 'vue';
import { formatDistance } from 'date-fns';

export default defineComponent({
  name: 'DataCard',
  props: {
    item: Object,
    isFound: Boolean,
  },

  emits: ['itemRemove'],

  setup() {
    const style = useCssModule();

    return {
      style,
    };
  },

  methods: {
    getClass(selected: boolean) {
      var result = [];
      if (selected) {
        result.push(this.style.datarowbackground);
      } else {
        result.push(this.style.datarow);
      }
      return result;
    },

    dateDistanceLocal(d: any) {
      var res = formatDistance(d, new Date(), { addSuffix: true });
      return res;
    },
  },
});
</script>

<style lang="scss" module>
@use 'sass/color';

.datarow {
  padding: 10px;
  border: 1px solid;
  margin-top: 10px;
  margin-left: 50px;
  margin-right: 50px;
  border-radius: 5px;
  width: 80%;
}

.datarowbackground {
  padding: 10px;
  border: 1px solid;
  background: color.$active-background;
  margin-top: 10px;
  margin-left: 50px;
  margin-right: 50px;
  border-radius: 5px;
  width: 80%;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.rowbuttons {
  margin-left: 10px;
}

.itemfound {
  color: color.$found;
}
</style>
