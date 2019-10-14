<template>
  <div class="view">
    <item-list-nav :feed="feed" :page="page" :max-page="maxPage" />

    <lazy-wrapper :loading="loading">
      <transition :name="transition" mode="out-in">
        <div :key="displayedPage" class="news-list">
          <transition-group tag="ul" name="item">
            <item v-for="item in feedItems" :key="item.id" :item="item" />
          </transition-group>
        </div>
      </transition>
      <item-list-nav :feed="feed" :page="page" :max-page="maxPage" />
    </lazy-wrapper>
  </div>
</template>

<script>
import Item from '~/components/Item.vue'
import ItemListNav from '~/components/ItemListNav.vue'
import LazyWrapper from '~/components/LazyWrapper'
import { feeds, validFeeds } from '~/common/api'
import gql from 'graphql-tag'

export default {
  components: {
    Item,
    ItemListNav,
    LazyWrapper
  },

  validate({ params: { feed } }) {
    return validFeeds.includes(feed)
  },

  data() {
    return {
      transition: 'slide-right',
      displayedPage: Number(this.page) || 1,
      feedItems: []
    }
  },

  computed: {
    feed() {
      return this.$route.params.feed
    },
    page() {
      return Number(this.$route.params.page) || 1
    },
    maxPage() {
      return feeds[this.feed].pages
    },
    loading() {
      return this.feedItems.length === 0
    }
  },

  apollo: {
    feedItems: {
      query: gql`
        query feedItems($type: String!, $index: Int!) {
          feeds(index: $index, type: $type) {
            id
            title
            points
            user
            time
            comments_count
            type
            url
          }
      }`,
      variables () {
        return {
          index: this.$route.params.page || 1,
          type: this.$route.params.feed
        }
      },
      update: data => data.feeds
    }
  },

  watch: {
    page: 'pageChanged'
  },

  head() {
    return {
      title: feeds[this.$route.params.feed].title
    }
  },

  mounted() {
    this.pageChanged(this.page)
  },

  methods: {
    pageChanged(to, from = -1) {
      if (to <= 0 || to > this.maxPage) {
        this.$router.replace(`/${this.feed}/1`)
        return
      }

      this.transition =
        from === -1 ? null : to > from ? 'slide-left' : 'slide-right'

      this.displayedPage = to
    }
  }
}
</script>

<style lang="stylus">
.news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list {
  margin: 10px 0;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.slide-left-enter, .slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-to, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.item-move, .item-enter-active, .item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
