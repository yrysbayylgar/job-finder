<script setup lang="ts">
interface Props {
  search: string
  position: string
  employmentType: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:position', value: string): void
  (e: 'update:employmentType', value: string): void
  (e: 'reset'): void
}>()

const positionOptions = [
  { label: 'Все должности', value: '' },
  { label: 'Frontend', value: 'Frontend' },
  { label: 'Backend', value: 'Backend' },
  { label: 'Design', value: 'Design' },
  { label: 'QA', value: 'QA' },
]

const employmentTypeOptions = [
  { label: 'Все типы занятости', value: '' },
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Part-time', value: 'Part-time' },
  { label: 'Internship', value: 'Internship' },
]

function onSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:search', target.value)
}

function onPositionChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:position', target.value)
}

function onEmploymentTypeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:employmentType', target.value)
}

function onReset() {
  emit('reset')
}
</script>

<template>
  <section class="job-filters" aria-label="Фильтры вакансий">
    <div class="filters-grid">
      <!-- Поиск по названию -->
      <div class="filter-group search-group">
        <label for="filter-search" class="filter-label">Поиск вакансии</label>
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            id="filter-search"
            type="search"
            class="filter-input search-input"
            placeholder="Например: Vue, Backend, QA..."
            :value="search"
            @input="onSearchInput"
          />
        </div>
      </div>

      <!-- Фильтр по должности -->
      <div class="filter-group">
        <label for="filter-position" class="filter-label">Должность</label>
        <select
          id="filter-position"
          class="filter-select"
          :value="position"
          @change="onPositionChange"
        >
          <option
            v-for="opt in positionOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Фильтр по типу занятости -->
      <div class="filter-group">
        <label for="filter-employment" class="filter-label">Тип занятости</label>
        <select
          id="filter-employment"
          class="filter-select"
          :value="employmentType"
          @change="onEmploymentTypeChange"
        >
          <option
            v-for="opt in employmentTypeOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Кнопка сброса -->
      <div class="filter-actions">
        <button
          type="button"
          class="reset-btn"
          :disabled="!search && !position && !employmentType"
          @click="onReset"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.job-filters {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr auto;
  gap: 16px;
  align-items: flex-end;
}

@media (max-width: 900px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 14px;
  color: #94a3b8;
  pointer-events: none;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-input {
  padding-left: 36px;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.filter-actions {
  display: flex;
}

.reset-btn {
  padding: 11px 18px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #475569;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.reset-btn:hover:not(:disabled) {
  background: #e2e8f0;
  color: #0f172a;
}

.reset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

