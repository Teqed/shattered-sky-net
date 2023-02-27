<script setup lang="ts">
useHead({
  title: 'Tabletop',
  meta: [{ name: 'description', content: 'Pen & Paper RPGs without the paper.' }],
});
</script>

<template>
  <div>
    <TileItem>
      <template #icon>
        <img src="../assets/icons/fvtt.png" style="width: 80%">
      </template>
      <template #heading>
        {{ $t('tabletop.card0.title') }}
      </template>

      <p>{{ $t('tabletop.card0.blurb') }}</p>
    </TileItem>

    <TileItem>
      <template #icon>
        🌌
      </template>
      <template #heading>
        {{ $t('tabletop.card1.title') }}
      </template>
      <div style="width: 50%; float: left">
        <p>
          <i>{{ $t('tabletop.card1.sub') }}</i><br><br>

          <i18n-t keypath="tabletop.card1.blurb" scope="global" for="tabletop.card1.linkText">
            <a href="https://tvtropes.org/pmwiki/pmwiki.php/Main/TwentyMinutesIntoTheFuture">
              {{ $t('tabletop.card1.linkText') }}
            </a>
          </i18n-t>
        </p>
        <br>
        <a
          href="https://foundry.shatteredsky.net/cyberpunk/"
          target="_blank"
          rel="noopener"
        >{{ $t('tabletop.card1.linkText2') }}</a>
      </div>
      <a href="https://foundry.shatteredsky.net/cyberpunk/">
        <img
          src="../assets/images/cyberpunk_group.webp"
          style="width: 45%;
            float: right;
            margin-left: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
          "
          alt="Cyberpunk RED"
        ></a>
    </TileItem>

    <TileItem>
      <template #icon>
        🧙
      </template>
      <template #heading>
        {{ $t('tabletop.card2.title') }}
      </template>
      <div style="width: 50%; float: left">
        <p>
          <i>{{ $t('tabletop.card2.sub') }}</i><br><br>

          {{ $t('tabletop.card2.blurb') }}
          <br><br>
        </p>
        <a
          href="https://foundry.shatteredsky.net/krune/"
          target="_blank"
          rel="noopener"
        >{{ $t('tabletop.card2.linkText') }}</a>
      </div>
      <a href="https://foundry.shatteredsky.net/krune/">
        <img
          src="../assets/images/krune_group.webp"
          style="width: 45%;
            float: right;
            margin-left: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
          "
          alt="The Waking Rune"
        >
      </a>
    </TileItem>

    <TileItem>
      <template #icon>
        🐦
      </template>
      <template #heading>
        {{ $t('tabletop.card3.title') }}
      </template>
      <div style="width: 50%; float: left">
        <p><i>{{ $t('tabletop.card3.sub') }}</i></p>
        <br>
        <p>
          {{ $t('tabletop.card3.blurb') }}
        </p>
        <br>
        <a
          href="https://foundry.shatteredsky.net/spheres/"
          target="_blank"
          rel="noopener"
        >{{ $t('tabletop.card3.linkText') }}</a>
      </div>
      <a href="https://foundry.shatteredsky.net/spheres/">
        <img
          src="../assets/images/spheres_group.webp"
          style="width: 45%;
            float: right;
            margin-left: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
          "
          alt="Spheres of Power"
        >
      </a>
    </TileItem>
  </div>
</template>
