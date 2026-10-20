# JobFinder — Платформа поиска вакансий (Vue 3 + Vuex)

Проект по поиску IT-вакансий с фильтрацией, авторизацией, избранным и откликами.

## 🛠 Стек технологий
- **Vue 3** (Composition API, `<script setup lang="ts">`)
- **Vuex 4** (модульная архитектура: `auth`, `favorites`, `jobs`, персистентность)
- **Vue Router 4** (динамические маршруты, навигация, редиректы)
- **Axios** (REST API клиент с перехватчиками и MockAPI)
- **MockAPI / localStorage** (сохранение сессии пользователя, избранного и откликов)
- **TypeScript** и **Vite**

---

## 👥 Распределение ролей и выполненных задач

### 🔹 Участник 1 — Авторизация и избранное (`feature/auth-favorites`)
- **Страница `/login`** (`LoginView.vue`): учебная авторизация по имени и email с валидацией, сохранением и редиректом обратно на страницу вакансии после входа.
- **Vuex-модуль `auth`** (`store/modules/auth.ts`): хранение текущего пользователя, actions `login` и `logout`.
- **Сохранение в `localStorage`**: автоматическое восстановление пользователя при обновлении страницы.
- **Vuex-модуль `favorites`** (`store/modules/favorites.ts`): добавление, удаление, проверка (`isFavorite`) и счётчик (`count`).
- **Страница `/favorites`** (`FavoritesView.vue`): список сохранённых вакансий с использованием общего компонента `JobCard.vue` и заглушкой при пустом списке.
- **Watcher и персистентность** (`store/persistence.ts`): синхронизация избранного с `localStorage`.
- **Шапка сайта** (`AppHeader.vue`): навигация, счётчик избранного, имя текущего пользователя, кнопки входа и выхода.

### 🔹 Участник 2 — Каталог, поиск и фильтры (`feature/jobs-catalog`)
- **Страница `/jobs`** (`JobsView.vue`): каталог вакансий с состояниями загрузки, ошибки (с кнопкой повтора) и пустого результата поиска.
- **Компонент `JobCard.vue`**: переиспользуемая карточка (название, компания, зарплата в ₸, город, тип занятости, бейджи, ссылка на подробности, кнопка избранного с custom event `toggle-favorite`).
- **Компонент `JobFilters.vue`**: поиск по названию/компании, фильтрация по должности (Frontend, Backend, Design, QA), типу занятости (Full-time, Part-time, Internship) и кнопка сброса.
- **Axios GET** (`api/jobs.ts`): функции `getJobs` и `getJobById`.
- **Vuex-модуль `jobs`** (`store/modules/jobs.ts`): состояние вакансий, флагов `loading` и `error`, action `fetchJobs`.
- **Lifecycle hook**: `onMounted` в `JobsView.vue` для загрузки списка при открытии страницы.
- **Mock-данные**: 12 детально проработанных вакансий (`api/mockData.ts`) с поддержкой MockAPI.

### 🔹 Участник 3 — Подробности вакансии и отклики (`feature/job-details-applications`)
- **Страница `/jobs/:id`** (`JobDetailsView.vue`): динамический маршрут, загрузка одной вакансии по ID через `api/jobs.ts`.
- **Отображение деталей**: компания, зарплата, город, тип занятости, полное описание, требования, кнопка добавления в избранное.
- **Компонент `ApplicationForm.vue`**: форма отклика (имя, email, сопроводительное письмо) с валидацией полей, автоподстановкой данных авторизованного пользователя и custom event `submit-application`.
- **Axios POST** (`api/applications.ts`): отправка отклика `submitApplication` на эндпоинт `/applications`.
- **Обработка прав доступа**: гостю предлагается войти (с сохранением редиректа на текущую вакансию через query `?redirect=/jobs/:id`), авторизованному доступна отправка отклика.
- **Состояния интерфейса**: загрузка, вакансия не найдена (404), ошибка, процесс отправки (`isSubmitting`) и сообщение об успешном отклике.
- **Vue Router** (`router/index.ts`): настройка 4 маршрутов (`/jobs`, `/jobs/:id`, `/favorites`, `/login`) и редиректов.

---

## 📋 Проверка требований преподавателя в коде

| Требование | Где реализовано |
|---|---|
| **Минимум 3 страницы** | 4 страницы: `/jobs`, `/jobs/:id`, `/favorites`, `/login` |
| **Динамический маршрут** | `/jobs/:id` (`JobDetailsView.vue`, `router/index.ts`) |
| **Навигация** | `<RouterLink>`, `useRouter`, `useRoute`, программные переходы |
| **Axios GET и POST** | `api/jobs.ts` (`GET /jobs`, `GET /jobs/:id`), `api/applications.ts` (`POST /applications`) |
| **Переиспользуемые компоненты** | `JobCard.vue`, `JobFilters.vue`, `ApplicationForm.vue`, `AppHeader.vue` |
| **Vuex: state, mutations, actions, getters** | `store/modules/auth.ts`, `favorites.ts`, `jobs.ts` |
| **Custom events** | `toggle-favorite` в `JobCard.vue`, `submit-application` в `ApplicationForm.vue`, события фильтров в `JobFilters.vue` |
| **Директивы Vue** | `v-for`, `v-if` / `v-else-if` / `v-else`, `v-model`, `v-bind` (`:`), `v-on` (`@`) |
| **Computed свойства** | Фильтрация в `JobsView.vue`, вычисляемые данные в `JobDetailsView.vue`, геттеры Vuex |
| **Watchers** | Слежение за store в `persistence.ts`, слежение за props в `ApplicationForm.vue` |
| **Lifecycle hooks** | `onMounted` в `JobsView.vue` и `JobDetailsView.vue` |
| **async / await** | Все методы загрузки данных и отправки форм в API, Vuex actions и views |
| **Загрузка и ошибки** | Спиннеры, сообщения об ошибках, кнопки повторного запроса (Retry) во всех представлениях |
| **Авторизация в Vuex + localStorage** | `store/modules/auth.ts` + localStorage |

---

## 🚀 Запуск проекта

1. Перейдите в папку проекта:
   ```bash
   cd vue-project
   ```

2. Установите зависимости (если ещё не установлены):
   ```bash
   npm install
   ```

3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```

4. Сборка и проверка типов:
   ```bash
   npm run build
   ```
