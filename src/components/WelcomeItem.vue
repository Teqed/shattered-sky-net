<template>
  <div class="item">
    <i_icon>
      <slot name="icon"></slot>
    </i_icon>
    <div class="details tile">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.tile {
  /* Addition */
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  background: rgba(71, 71, 71, 0.404);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.1);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border: 1px solid rgba(121, 121, 121, 0.51);
  transition: box-shadow 0.3s ease-in-out;
}

.tile:hover {
  box-shadow: 0 4px 30px rgba(121, 121, 121, 0.25);
}
.item {
  margin-top: 2rem;
  display: flex;
  animation: fadein 1s ease, slidein_top 1s ease-out;
}

.details {
  flex: 1;
  margin-left: 1rem;
  animation: fadein 1s ease, slidein_top 1s ease-out;
}

i_icon {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
  animation: fadein 1s ease, slidein_top 1s ease-out;
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

/* @mixin for-phone-only { */
@media (max-width: 599px) {
  .tile {
    width: 85vw;
  }
}
/* @mixin for-tablet-portrait-up { */
@media (min-width: 600px) {
  .tile {
    width: 80vw;
  }
  nav {
    margin-left: -1rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
  /* .logo {
    position: relative;
    float: left;
    display: block;
  } */
}
/* @mixin for-tablet-landscape-up { */
@media (min-width: 900px) {
  .tile {
    width: 65vw;
  }
}
/* @mixin for-desktop-up { */
@media (min-width: 1200px) {
  .tile {
    width: 45vw;
    padding-top: 0.8rem;
    padding-bottom: 0.8rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
    /* animation: fadein 1s ease, slidein_top 1s ease-out; */
  }

  i_icon {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    width: 50px;
    height: 50px;
    /* Addition */
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-left: 0.6rem;
    padding-right: 0.6rem;
    background: rgba(71, 71, 71, 0.404);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: saturate(180%) blur(10px);
    -webkit-backdrop-filter: saturate(180%) blur(10px);
    border: 1px solid rgba(121, 121, 121, 0.51);
  }

  .item:before {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
  /* @mixin for-med-desktop-up { */
  @media (min-width: 1800px) {
    .tile {
      width: 40vw;
    }
  }
  /* @mixin for-big-desktop-up { */
  @media (min-width: 1921px) {
    .tile {
      width: 30vw;
    }
  }
}
</style>
