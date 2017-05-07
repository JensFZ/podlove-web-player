<template>
    <div class="embed">
      <h4 class="title">{{ $t('SHARE.EMBED') }}</h4>
      <div class="input-row input-group">
        <input type="text" class="input-text" disabled :value="clipboardContent(reference, share.embed, playtime)" />
        <PodloveButton
          class="input-button truncate"
          :data-clipboard-text="clipboardContent(reference, share.embed, playtime)"
          v-clipboard
          :style="buttonStyle(theme)">
             {{ $t('SHARE.COPY') }}
        </PodloveButton>
      </div>
      <div class="input-row">
        <div class="share-config--time">
          <label class="input-label"><input type="checkbox" class="embed--checkbox" :value="share.embed.start" v-on:change="toggleEmbedStart(playtime)"/> {{ $t('SHARE.START') }}</label>
          <input type="text" class="input-text" :value="secondsToTime(share.embed.starttime)" v-on:input="setStarttime"/>
        </div>
        <div class="share-config--size">
          <label class="input-label">{{ $t('SHARE.SIZE') }}</label>
          <select class="share-input" v-model="share.embed.size" v-on:change="setEmbedSize(share.embed.size)">
            <option v-for="option in share.embed.availableSizes" v-bind:value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>
    </div>
</template>

<script>
  import { debounce, get } from 'lodash'
  import { addQueryParameter } from 'utils/url'

  import store from 'store'
  import { secondsToTime, timeToSeconds } from 'utils/time'

  import PodloveButton from 'shared/Button.vue'

  const buttonStyle = (theme) => ({
    color: theme.tabs.button.text,
    background: theme.tabs.button.background
  })

  // Embed
  const clipboardContent = (reference, embed, playtime) => {
    const [width, height] = embed.size.split('x')

    const parameters = {
      episode: reference.config
    }

    if (embed.start) {
      parameters.t = secondsToTime(embed.starttime)
    }

    return `<iframe width="${width}" height="${height}" src="${addQueryParameter(reference.share, parameters)}" frameborder="0" scrolling="no"></iframe>`
  }

  const setEmbedSize = size => {
    store.dispatch(store.actions.setShareEmbedSize(size))
  }

  const toggleEmbedStart = time => {
    store.dispatch(store.actions.toggleShareEmbedStart())
    store.dispatch(store.actions.setShareEmbedStarttime(time))
  }

  const setStarttime = debounce(input => {
    const duration = get(store.store.getState(), 'duration')
    let time = timeToSeconds(input.target.value)

    if (!time) {
      return
    }

    if (time > duration) {
      time = duration
    }

    store.dispatch(store.actions.setShareEmbedStarttime(time))
  }, 1000)


  export default {
    data() {
      return {
        share: this.$select('share'),
        reference: this.$select('reference'),
        playtime: this.$select('playtime'),
        duration: this.$select('duration'),
        theme: this.$select('theme')
      }
    },
    methods: {
      secondsToTime,
      buttonStyle,

      setEmbedSize,
      clipboardContent,
      toggleEmbedStart,
      setStarttime,
    },
    components: {
      PodloveButton
    }
  }

</script>

<style lang="scss">
  @import 'variables';
  @import 'utils';
  @import 'inputs';

  $embed-width: 40px;
  $embed-height: 35px;
  $size-button-width: 80px;

  .podlove-share {
    padding: $padding;

    .share-config--time, .share-config--size {
      line-height: 1em;
    }

    @media screen and (max-width: $width-m) {
      .share-config--time, .share-config--size {
        .input-label {
          display: block;
        }
      }
    }
  }

</style>