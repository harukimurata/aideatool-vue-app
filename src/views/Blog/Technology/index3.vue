<template>
  <header-component title="後日談"></header-component>

  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card has-text-left">
        <header class="card-header">
          <p class="card-header-title" @click="toLink('Blog')">
            <span class="has-text-link pr-1">後日談</span>/Ubuntuでサーバー構築 その３
          </p>
        </header>
        <div class="card-content">
          <h1 class="title pt-3">Ubuntuでサーバー構築 その３</h1>
          無料のドメイン取得、サイト公開
          <h1 class="title pt-3">Ubuntu の ドメイン設定</h1>
          ここでは無料で設定できる方法で紹介します。<br />
          別方法での取得の場合、設定方法が異なる場合があるので注意が必要です。<br />
          サイトの公開は住まいのインターネット環境によって変化する場合があります。<br />
          事前に調べておくことをお勧めします。

          <h2 class="title pt-3">DDNS No-IPで無料ドメイン取得</h2>
          - https://www.noip.com/ でアカウント登録をする<br />
          サイトに沿って名前や登録したいドメイン名を入れていく。<br />
          取得できたドメインに対してグローバルIPアドレスを設定して終了
          <hr />
          <h2 class="title pt-3">ddclient の導入</h2>
          <p class="has-background-grey-lighter pl-2">$ sudo apt install ddclient</p>
          下記のように入力していく<br />
          - Dynamic DNS サービスプロバイダ<br />
          その他<br />
          - Dynamic DNS サーバ<br />
          dynupdate.no-ip-com<br />
          - Dynamic DNS の更新プロトコル<br />
          dyndns2<br />
          - Dynamic DNS サービスユーザー名<br />
          no-ip のアカウント名<br />
          - Dynamic DNS サービスのパスワード<br />
          no-ip のパスワード<br />
          - Re-enter password to verify<br />
          no-ip のパスワード<br />
          - Dynamic DNS サービスのインタフェース<br />
          web<br />
          - DynDNS の完全修飾ドメイン名<br />
          取得したドメイン名(domain.com)
          <hr />
          ddclientのファイル編集<br />
          編集するファイル /etc/ddclient.conf
          <p class="has-background-grey-lighter pl-2">use=if, if=web</p>
          <p class="has-background-grey-lighter pl-2">↓</p>
          <p class="has-background-grey-lighter pl-2">use=web</p>
          に変更する
          <hr />
          <h2 class="title pt-3">Let's Encryptで無料の証明書取得</h2>
          - Let's Encrypt の導入
          <p class="has-background-grey-lighter pl-2">
            $ sudo apt -y install letsencrypt python3-certbot-nginx
          </p>
          下記のように入力していく<br />
          - メールアドレス入力<br />
          - A を選択して Enter<br />
          - Y を押して Enter<br />
          - 取得したドメイン名を入力して Enter<br />
          - 2 を入力して Enter<br />
          Congratulations!が出れば成功
          <p class="has-background-grey-lighter pl-2">$ sudo certbot --nginx</p>
          <p class="has-background-grey-lighter pl-2">$ sudo certbot renew --dry-run</p>
          - 有効期限の自動更新
          <p class="has-background-grey-lighter pl-2 mb-1">sudo crontab -e</p>
          設定内容
          <p class="has-background-grey-lighter pl-2">00 05 01 * * certbot renew</p>
          - ファイアウォール設定追加 ssl のポートを開放する
          <p class="has-background-grey-lighter pl-2 mb-1">sudo ufw allow 443</p>
          <p class="has-background-grey-lighter pl-2 mb-1">sudo ufw reload</p>
          <hr />
          <h2 class="title pt-3">ポートの変換</h2>
          - ルータの設定を変更 使用しているルータに接続しポート変換の設定を行う。<br />
          サーバーのローカルIPアドレスとポート443・ポート80を追加する。<br />
          登録したドメインで検索すると構築したサーバーに接続できるようになる。
          <hr />
          以上がサーバー構築から無料ドメイン取得までの手順です。<br />
          フロントエンドの構築やバックエンドの構築方法は開発環境によって変化します。<br />
          セキュリティやここから先の環境構築はトライしてみてください。
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
