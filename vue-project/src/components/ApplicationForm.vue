<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  initialName?: string
  initialEmail?: string
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialName: '',
  initialEmail: '',
  isSubmitting: false,
})

const emit = defineEmits<{
  (e: 'submit-application', data: { name: string; email: string; coverLetter: string }): void
}>()

const name = ref(props.initialName)
const email = ref(props.initialEmail)
const coverLetter = ref('')

const errors = ref({
  name: '',
  email: '',
  coverLetter: '',
})

// Если props меняются (например, обновился пользователь в store), обновляем поля формы
watch(
  () => props.initialName,
  (newVal) => {
    if (!name.value && newVal) {
      name.value = newVal
    }
  },
  { immediate: true },
)

watch(
  () => props.initialEmail,
  (newVal) => {
    if (!email.value && newVal) {
      email.value = newVal
    }
  },
  { immediate: true },
)

function validate(): boolean {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    coverLetter: '',
  }

  // Проверка имени
  if (!name.value.trim()) {
    errors.value.name = 'Пожалуйста, введите ваше имя'
    isValid = false
  } else if (name.value.trim().length < 2) {
    errors.value.name = 'Имя должно содержать не менее 2 символов'
    isValid = false
  }

  // Проверка email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim()) {
    errors.value.email = 'Пожалуйста, введите контактный email'
    isValid = false
  } else if (!emailRegex.test(email.value.trim())) {
    errors.value.email = 'Пожалуйста, введите корректный адрес email'
    isValid = false
  }

  // Проверка сопроводительного письма
  if (!coverLetter.value.trim()) {
    errors.value.coverLetter = 'Пожалуйста, напишите краткое сопроводительное письмо'
    isValid = false
  } else if (coverLetter.value.trim().length < 10) {
    errors.value.coverLetter = 'Сопроводительное письмо должно содержать хотя бы 10 символов'
    isValid = false
  }

  return isValid
}

function handleSubmit() {
  if (!validate()) return

  emit('submit-application', {
    name: name.value.trim(),
    email: email.value.trim(),
    coverLetter: coverLetter.value.trim(),
  })
}
</script>

<template>
  <form class="application-form" novalidate @submit.prevent="handleSubmit">
    <h3 class="form-title">Отклик на вакансию</h3>
    <p class="form-desc">
      Заполните форму ниже, и работодатель свяжется с вами по указанным контактам.
    </p>

    <!-- Имя -->
    <div class="form-field">
      <label for="app-name" class="field-label">Ваше имя *</label>
      <input
        id="app-name"
        v-model="name"
        type="text"
        class="form-input"
        :class="{ 'has-error': errors.name }"
        placeholder="Иван Иванов"
        autocomplete="name"
        :disabled="isSubmitting"
      />
      <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
    </div>

    <!-- Email -->
    <div class="form-field">
      <label for="app-email" class="field-label">Электронная почта *</label>
      <input
        id="app-email"
        v-model="email"
        type="email"
        class="form-input"
        :class="{ 'has-error': errors.email }"
        placeholder="example@mail.kz"
        autocomplete="email"
        :disabled="isSubmitting"
      />
      <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
    </div>

    <!-- Сопроводительное письмо -->
    <div class="form-field">
      <label for="app-cover-letter" class="field-label">Сопроводительное письмо *</label>
      <textarea
        id="app-cover-letter"
        v-model="coverLetter"
        class="form-textarea"
        :class="{ 'has-error': errors.coverLetter }"
        rows="4"
        placeholder="Расскажите о своем опыте, ключевых навыках и почему вам интересна эта позиция…"
        :disabled="isSubmitting"
      ></textarea>
      <span v-if="errors.coverLetter" class="field-error">{{ errors.coverLetter }}</span>
    </div>

    <button type="submit" class="submit-btn" :disabled="isSubmitting">
      <span v-if="isSubmitting" class="spinner-small"></span>
      {{ isSubmitting ? 'Отправка отклика…' : 'Отправить отклик' }}
    </button>
  </form>
</template>

<style scoped>
.application-form {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.form-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.form-desc {
  margin: 0 0 20px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.form-input:focus,
.form-textarea:focus {
  background: white;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-input.has-error,
.form-textarea.has-error {
  border-color: #ef4444;
  background: #fff5f5;
}

.field-error {
  margin-top: 5px;
  font-size: 13px;
  color: #ef4444;
}

.form-textarea {
  resize: vertical;
  min-height: 90px;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

