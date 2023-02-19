<script setup lang="ts">
useHead({
  title: 'Tabletop - Shattered Sky',
  meta: [{ name: 'description', content: 'Pen & Paper RPGs without the paper.' }],
});
</script>

<template>
  <main>
    <TileItem>
      <template #icon>
        <img src="../assets/icons/fvtt.png" style="width: 80%">
      </template>
      <template #heading>
        Foundry Virtual Tabletop
      </template>

      <p>Pen & Paper RPGs without the paper.</p>
    </TileItem>

    <TileItem>
      <template #icon>
        🌌
      </template>
      <template #heading>
        Cyberpunk
      </template>
      <div style="width: 50%; float: left">
        <p>
          <i>"High tech, low life."</i><br><br>

          Cyberpunk RED by R. Talsorian Games, set
          <a href="https://tvtropes.org/pmwiki/pmwiki.php/Main/TwentyMinutesIntoTheFuture">twenty minutes
          </a>
          into the future. A group of edgerunners are recruited by their fixer to fulfill corporate
          contracts for conspiracies larger than they could imagine.
        </p>
        <br>
        <a
          href="https://foundry.shatteredsky.net/cyberpunk/"
          target="_blank"
          rel="noopener"
        >Login here.</a>
      </div>
      <a href="https://foundry.shatteredsky.net/cyberpunk/">
        <img
          src="../assets/images/cyberpunk_group.webp"
          style="
            width: 45%;
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
        The Waking Rune
      </template>
      <div style="width: 50%; float: left">
        <p>
          <i>"In the Varisian Gulf near Magnimar, a Runecarved Key was found with nothing in history
            explaining what it was or did."</i><br><br>

          Season 4 of the Pathfinder Society Roleplaying Guild campaign is referred to as the Year
          of the Risen Rune due to the season's prominent presence in Varisia and activities dealing
          with the mystic civilizations ruled by ancient wizard kings, or Runelords, that were lost
          to time.
          <br><br>
        </p>
        <a
          href="https://foundry.shatteredsky.net/krune/"
          target="_blank"
          rel="noopener"
        >Login here.</a>
      </div>
      <a href="https://foundry.shatteredsky.net/krune/">
        <img
          src="../assets/images/krune_group.webp"
          style="
            width: 45%;
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
        Spheres of Power
      </template>
      <div style="width: 50%; float: left">
        <p><i>"Squawk."</i></p>
        <br>
        <p>
          A Skybourne-inspired Spheres of Power campaign. Airships are the primary form of travel
          between disconnected civilizations, requiring a crew of sailors to man and protect from
          hazardous weather and flying monsters. Spheres of Power provides versatile character
          building options, along with Spheres of War for martials.
        </p>
        <br>
        <a
          href="https://foundry.shatteredsky.net/spheres/"
          target="_blank"
          rel="noopener"
        >Login here.</a>
      </div>
      <a href="https://foundry.shatteredsky.net/spheres/">
        <img
          src="../assets/images/spheres_group.webp"
          style="
            width: 45%;
            float: right;
            margin-left: 1rem;
            margin-bottom: 1rem;
            border-radius: 0.5rem;
          "
          alt="Spheres of Power"
        >
      </a>
    </TileItem>
  </main>
</template>
