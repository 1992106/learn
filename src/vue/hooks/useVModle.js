import { computed } from 'vue';

// https://mp.weixin.qq.com/s/_CAKoCT3izbR1YPFb9wzew
export default function useVModle(props, propName, emit) {
  return computed({
    get() {
      return new Proxy(props[propName], {
        get(target, key) {
          return Reflect.get(target, key);
        },
        set(target, key, newValue) {
          emit('update:' + propName, {
            ...target,
            [key]: newValue
          });
          return true;
        }
      });
    },
    set(value) {
      emit('update:' + propName, value);
    }
  });
}
