<template>
  <div>
    <div class="d-flex gap-2 align-center flex-wrap">
      <div v-for="field in fields" :key="field.key">
        <div class="text-caption text-center mb-1">{{ field.label }}</div>
        <v-select
          v-model="selected[field.key]"
          :items="field.options"
          item-title="label"
          item-value="value"
          density="compact"
          hide-details
          style="min-width: 100px"
          @update:modelValue="emitCron"
        />
      </div>
    </div>
    <div class="mt-2 text-caption text-grey">
      Cron 표현식: <strong>{{ cronExpression }}</strong>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: String,
});

const selected = ref({
  second: "0",
  minute: "0/1",
  hour: "*",
  day: "*",
  month: "*",
  weekday: "?",
});

const fields = [
  {
    key: "second",
    label: "초",
    options: [
      { label: "0초", value: "0" },
      { label: "매초", value: "*" },
    ],
  },
  {
    key: "minute",
    label: "분",
    options: [
      { label: "매분", value: "*" },
      { label: "매 1분", value: "0/1" },
      { label: "매 5분", value: "0/5" },
      { label: "매 10분", value: "0/10" },
      { label: "매 30분", value: "0/30" },
      { label: "0분", value: "0" },
    ],
  },
  {
    key: "hour",
    label: "시",
    options: [
      { label: "매시", value: "*" },
      { label: "매 1시간", value: "0/1" },
      { label: "매 6시간", value: "0/6" },
      { label: "0시", value: "0" },
      { label: "9시", value: "9" },
      { label: "18시", value: "18" },
    ],
  },
  {
    key: "day",
    label: "일",
    options: [
      { label: "매일", value: "*" },
      { label: "1일", value: "1" },
      { label: "15일", value: "15" },
      { label: "말일", value: "L" },
      { label: "미지정", value: "?" },
    ],
  },
  {
    key: "month",
    label: "월",
    options: [
      { label: "매월", value: "*" },
      { label: "1월", value: "1" },
      { label: "3월", value: "3" },
      { label: "6월", value: "6" },
      { label: "12월", value: "12" },
    ],
  },
  {
    key: "weekday",
    label: "요일",
    options: [
      { label: "미지정", value: "?" },
      { label: "매일", value: "*" },
      { label: "평일", value: "MON-FRI" },
      { label: "주말", value: "SAT,SUN" },
      { label: "월요일", value: "MON" },
    ],
  },
];

const cronExpression = computed(() => {
  const s = selected.value;
  return `${s.second} ${s.minute} ${s.hour} ${s.day} ${s.month} ${s.weekday}`;
});

// 부모 값이 들어오면 파싱해서 각 필드에 반영
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    const parts = val.trim().split(" ");
    if (parts.length === 6) {
      selected.value = {
        second: parts[0],
        minute: parts[1],
        hour: parts[2],
        day: parts[3],
        month: parts[4],
        weekday: parts[5],
      };
    }
  },
  { immediate: true },
);

// 셀렉트 변경 시만 emit
const emitCron = () => {
  emit("update:modelValue", cronExpression.value);
};
</script>
