<template>
  <header-component title="後日談"></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card has-text-left">
        <header class="card-header">
          <p class="card-header-title" @click="toLink('Blog')">
            <span class="has-text-link pr-1">後日談</span>/Ubuntuでサーバー構築 その２
          </p>
        </header>
        <div class="card-content">
          <h1 class="title pt-3">Ubuntuでサーバー構築 その２</h1>
          nginxでサーバー構築
          <h1 class="title pt-3">Ubuntu の サーバー構築</h1>
          <hr />
          <h2 class="title pt-3">Nginx のインストール</h2>
          - Nginx 用のポートを開ける<br />
          <p class="has-background-grey-lighter pl-2">$ sudo ufw allow 80</p>
          - Nginx のインストール<br />
          <p class="has-background-grey-lighter pl-2">$ sudo apt install nginx</p>
          - ブラウザで確認 <br />
          ブラウザを開き サーバーのローカルIP アドレス打ち込み<br />
          Nginx の初期画面が出てくると成功
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}
</script>
