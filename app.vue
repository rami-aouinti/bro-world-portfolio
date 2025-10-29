<template>
  <Suspense>
    <template #default>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </template>
    <template #fallback>
      <AppLoader />
    </template>
  </Suspense>
</template>
