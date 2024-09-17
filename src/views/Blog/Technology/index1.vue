<template>
  <header-component title="後日談"></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card has-text-left">
        <header class="card-header">
          <p class="card-header-title" @click="toLink('Blog')">
            <span class="has-text-link pr-1">後日談</span>/Ubuntuでサーバー構築 その１
          </p>
        </header>
        <div class="card-content">
          <h1 class="title pt-3">Ubuntuでサーバー構築 その１</h1>
          ubuntuの初期設定からnginxでサーバー構築、無料のドメイン取得、サイト公開までの手順です。<br />
          全３回で紹介します。Let's Try！
          <h1 class="title pt-3">Ubuntu の初期設定</h1>
          <hr />
          <h2 class="title pt-3">Ubuntu のインストール</h2>
          <div>
            インストール disc、イメージファイルのダウンロードなど<br />
            その時に合った方法でインストールで行う<br />
            ubuntuを不要になったPCにOSとしてインストールする場合は<br />
            ubuntuが入っている記憶媒体からPCを起動するようにする。<br />
            <br />
            BIOSの設定の変更が必要になる場合があります。<br />
          </div>
          <br />
          <div>
            インストール後に IP アドレスを控えておく<br />
            Ubuntu
            <p class="has-background-grey-lighter pl-2">$ ip route</p>
            Windows
            <p class="has-background-grey-lighter pl-2">$ ipconfig</p>
            デフォルトゲートウェイなどを確認して<br />
            そこに記載された IP アドレスを控える
          </div>
          <hr />
          <h2 class="title pt-3">固定IPの設定</h2>
          IP アドレスが<br />
          {192.168.1.1}であれば
          <br />
          {192.168.1.2}~{192.168.1.254}、
          <br />
          {192.168.225.100}であれば
          <br />
          {192.168.225.101}~{192.168.225.254}の範囲で設定する
          <br />
          <br />
          * アドレスの設定を手動に変更する手順<br />
          - IP アドレス {192.168.1.10}<br />
          - ネットマスク {24}<br />
          - ゲートウェイ {192.168.1.1}<br />
          - DNS {192.168.1.1}<br />
          で設定する。 <br />
          その後無線や有線の接続を OFF→ON する。
          <hr />
          <h2 class="title pt-3">ファイアウォール設定</h2>
          ファイアウォールは最初非アクティブの状態になっている。 <br />
          最低限のセキュリティーを入れるためファイアウォールの設定を行う。<br />
          - 現在の状態を確認<br />
          <p class="has-background-grey-lighter pl-2">$ sudo ufw status</p>
          最初は非アクティブになっているはず<br />
          - ファイアウォールの有効化<br />
          <p class="has-background-grey-lighter pl-2">$ sudo ufw enable</p>
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
