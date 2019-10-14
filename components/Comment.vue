<template>
  <li v-if="loadedComments && loadedComments.user" class="comment">
    <div class="by">
      <router-link :to="'/user/' + loadedComments.user">
        {{ loadedComments.user }}
      </router-link>
      {{ loadedComments.time | timeAgo }} ago
    </div>
    <div class="text" v-html="loadedComments.content" />
    <div v-if="loadedComments.comments && loadedComments.comments.length" :class="{ open }" class="toggle">
      <a @click="open = !open">{{ open ? '[-]' : '[+] ' + pluralize(loadedComments.comments.length) + ' collapsed' }}
      </a>
    </div>
    <ul v-show="open" class="comment-children">
      <comment v-for="childComment in loadedComments.comments" :key="childComment.id" :comment="childComment" />
    </ul>
  </li>
</template>

<script>
import gql from 'graphql-tag'
const comments = gql`
  query comments($id: Int!) {
    item(id: $id) {
      id
      title
      points
      user
      time
      content
      comments {
        id
      }
    }
  }
`;

export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: true
    }
  },
  computed: {
    id() {
      return this.comment.id
    }
  },
  apollo: {
    $loadingKey: 'loading',
    loadedComments: {
      query: comments,
      variables () {
        return {
          id: this.id
        }
      }
    }
  },
  methods: {
    pluralize: n => n + (n === 1 ? ' reply' : ' replies')
  }
}
</script>

<style lang="stylus">
.comment-children {
  .comment-children {
    margin-left: 1.5em;
  }
}

.comment {
  border-top: 1px solid #eee;
  position: relative;

  .by, .text, .toggle {
    font-size: 0.9em;
    margin: 1em 0;
  }

  .by {
    color: #222;

    a {
      color: #222;
      text-decoration: underline;
    }
  }

  .text {
    overflow-wrap: break-word;

    a:hover {
      color: #111;
    }

    pre {
      white-space: pre-wrap;
    }
  }

  .toggle {
    background-color: #fffbf2;
    padding: 0.3em 0.5em;
    border-radius: 4px;

    a {
      color: #222;
      cursor: pointer;
    }

    &.open {
      padding: 0;
      background-color: transparent;
      margin-bottom: -0.5em;
    }
  }
}
</style>
