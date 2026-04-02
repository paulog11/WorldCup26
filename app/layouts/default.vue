<template>
  <div class="min-h-screen bg-wc-dark text-wc-light flex flex-col">
    <LayoutNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-wc-purple py-8 text-center text-wc-light/50 text-sm">
      <p>2026 FIFA World Cup &mdash; USA, Canada & Mexico</p>
      <p class="mt-1">June 11 &ndash; July 19, 2026</p>
    </footer>
  </div>
</template>
