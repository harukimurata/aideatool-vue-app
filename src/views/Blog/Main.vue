<template>
  <header-component title="後日談"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title" @click="toLink('Blog')">後日談</p>
          <div class="dropdown is-right" :class="{ 'is-active': idHeaderOpen }">
            <div class="dropdown-trigger">
              <button
                class="button mt-1 mr-2"
                aria-haspopup="true"
                aria-controls="dropdown-menu3"
                @click="idHeaderOpen = !idHeaderOpen"
              >
                <span v-if="idHeaderOpen">×</span>
                <span v-else class="px-0">＝</span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu3" role="menu">
              <div class="dropdown-content has-text-left">
                <p
                  v-for="blog in blogTypeList"
                  class="dropdown-item has-text-link"
                  @click="filterBlogType(blog.blogType)"
                >
                  {{ blog.title }}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div class="card-content">
          <div v-if="sortList.length != 0">
            <div v-for="blog in sortList" class="columns">
              <div class="column is-half is-offset-one-quarter">
                <button
                  class="button is-fullwidth"
                  @click="toLink(`${BlogUrl[blog.blogType]}_${blog.index}`)"
                >
                  {{ blog.title }}
                </button>
              </div>
            </div>
          </div>
          <div v-else>該当なし</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const idHeaderOpen = ref(false)

enum BlogType {
  all,
  technology,
  diary,
  likes
}

type Blog = {
  blogType: BlogType
  title: string
  index?: number
}

const BlogUrl = {
  [BlogType.all]: 'all',
  [BlogType.technology]: 'technology',
  [BlogType.diary]: 'diary',
  [BlogType.likes]: 'likes'
}

const blogTypeList: Blog[] = [
  {
    blogType: BlogType.all,
    title: '全部'
  },
  {
    blogType: BlogType.technology,
    title: '技術系'
  },
  {
    blogType: BlogType.diary,
    title: '日記'
  },
  {
    blogType: BlogType.likes,
    title: '好きなもの'
  }
]

const blogList: Blog[] = [
  {
    blogType: BlogType.technology,
    title: 'Ubuntuでサーバー構築 その１',
    index: 1
  },
  {
    blogType: BlogType.technology,
    title: 'Ubuntuでサーバー構築 その２',
    index: 2
  },
  {
    blogType: BlogType.technology,
    title: 'Ubuntuでサーバー構築 その３',
    index: 3
  }
]

const sortList = ref<Blog[]>(blogList)

function filterBlogType(value: BlogType) {
  if (value == BlogType.all) {
    sortList.value = blogList
  } else {
    sortList.value = blogList.filter((blog) => blog.blogType == value)
  }
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}
</script>

<style scoped></style>
