<template>
  <div class="info" id="header-info" v-if="hasPoster || hasShowTitle || hasEpisodeTitle || hasDescription">
    <div class="poster" v-if="hasPoster" id="header-poster">
      <div class="poster-container" :style="posterStyle">
        <img class="poster-image" :src="episode.poster || show.poster" :alt="alternativeText" @error="onImageLoad">
      </div>
    </div>
    <div class="description">
      <h2 class="show-title" :style="titleStyle" v-if="hasShowTitle" id="header-showtitle">
        <a :href="show.link" target="_blank" class="truncate" v-if="show.link">{{ show.title }}</a>
        <span class="truncate" v-else>{{ show.title }}</span>
      </h2>
      <h1 class="title" v-marquee :style="titleStyle" v-if="hasEpisodeTitle" id="header-title">
        <a :href="episode.link" target="_blank" v-if="episode.link">{{ episode.title }}</a>
        <span v-else>{{ episode.title }}</span>
      </h1>
      <h3 class="subtitle" :style="subtitleStyle" v-if="hasDescription" id="header-subtitle">{{ episode.subtitle }}</h3>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'redux-vuex'

  import color from 'color'

  export default {
    data: mapState('episode', 'show', 'theme', 'display', 'visibleComponents', 'components'),
    computed: {
      titleStyle () {
        return {
          color: this.theme.player.title
        }
      },
      posterStyle () {
        return {
          'border-color': this.theme.player.poster
        }
      },
      subtitleStyle () {
        return {
          color: color(this.theme.player.text).fade(0.25)
        }
      },
      hasPoster () {
        return (this.episode.poster || this.show.poster) &&
          this.visibleComponents.poster && this.components.header.poster
      },
      hasShowTitle () {
        return this.show.title && this.visibleComponents.showTitle
      },
      hasEpisodeTitle () {
        return this.episode.title && this.visibleComponents.episodeTitle
      },
      hasDescription () {
        return this.episode.subtitle && this.visibleComponents.subtitle
      },
      alternativeText () {
        if (this.episode.poster) {
          return this.$t('A11Y.ALT_EPISODE_COVER')
        }

        if (this.show.poster) {
          return this.$t('A11Y.ALT_SHOW_COVER')
        }
      }
    },
    methods: mapActions({
      onImageLoad: ({ dispatch, actions }) => {
        dispatch(actions.toggleInfoPoster(false))
      }
    })
  }
</script>

<style lang="scss">
  @import '~styles/variables';

  $poster-size: 100px;
  $description-height: 100px;

  .info {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding-top: $padding;

    .poster {
      margin: 0 $margin 0 0;
    }

    .poster-container {
      height: $poster-size;
      line-height: 0;
      border-width: 2px;
      border-style: solid;

      .poster-image {
        max-height: 100%;
        max-width: none;
        width: auto;
      }
    }

    .title {
      margin-top: 0;
      margin-bottom: $margin / 4;
      font-weight: inherit;
      font-size: 1.8em;

      a, span {
        display: block;
      }
    }

    .show-title {
      margin: 0;
      font-weight: inherit;
      font-size: 1em;
      line-height: 1.2em;
      min-width: 0;

      a, span {
        display: block;
      }
    }

    .description {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }

    .subtitle {
      overflow: hidden;
      margin: 0;
      height: 2.75em;
      line-height: 1.3em;
      font-size: 1.1em;
      font-weight: 100;
      hyphens: auto;
    }
  }

  @media screen and (max-width: $width-m) {
    .info {
      flex-direction: column;
      text-align: center;

      .poster {
        width: 100%;
        display: flex;
        margin: 0 0 $margin 0;
        justify-content: center;
      }

      .poster-container {
        height: calc(#{$poster-size} + 3em); // Height of description
      }
    }
  }
</style>
