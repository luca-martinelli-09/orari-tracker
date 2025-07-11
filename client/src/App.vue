<template>
  <div
    id="app"
    class="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo e Brand -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <div
                class="w-10 h-10 bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <div
                  class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-sm"
                ></div>
              </div>
            </div>
            <div class="flex flex-col">
              <h1
                class="text-xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-indigo-600 bg-clip-text text-transparent"
              >
                Orari Tracker
              </h1>
              <p class="text-xs text-gray-500 hidden sm:block">
                Gestione professionale orari e spese
              </p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <router-link
              to="/"
              class="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              :class="
                $route.name === 'WorkHours'
                  ? 'text-blue-600 bg-blue-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Orari</span>
              <div
                v-if="$route.name === 'WorkHours'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
              ></div>
            </router-link>

            <router-link
              to="/expenses"
              class="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              :class="
                $route.name === 'Expenses'
                  ? 'text-emerald-600 bg-emerald-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span>Rimborsi</span>
              <div
                v-if="$route.name === 'Expenses'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"
              ></div>
            </router-link>

            <router-link
              to="/settings"
              class="group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              :class="
                $route.name === 'Settings'
                  ? 'text-purple-600 bg-purple-50 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Config</span>
              <div
                v-if="$route.name === 'Settings'"
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full"
              ></div>
            </router-link>
          </nav>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="!mobileMenuOpen"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div
          v-if="mobileMenuOpen"
          class="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link
              to="/"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              :class="
                $route.name === 'WorkHours'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Orari di Lavoro</span>
            </router-link>

            <router-link
              to="/expenses"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              :class="
                $route.name === 'Expenses'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span>Rimborsi Spese</span>
            </router-link>

            <router-link
              to="/settings"
              @click="mobileMenuOpen = false"
              class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              :class="
                $route.name === 'Settings'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              "
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Impostazioni</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      mobileMenuOpen: false,
    };
  },
};
</script>
