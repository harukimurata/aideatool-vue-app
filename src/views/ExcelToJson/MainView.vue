<template>
  <header-component title="ExcelToJson"></header-component>
  <div class="columns is-mobile is-centered mx-2">
    <div class="column is-11 mt-3">
      <div class="card">
        <div class="card-content">
          <h1 class="title pt-3">ExcelToJson</h1>
          <div class="has-text-left">
            <p>エクセルファイルのSheet1のデータをjson形式で返します。</p>
            <p>以下の様なデータをjson形式に変換してダウンロード出来ます。</p>
          </div>

          <img class="mt-3" src="../../assets/excelSample.png" />

          <div class="file has-name mt-3">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" @change="handler.onChange" />
              <span class="file-cta">
                <span class="file-label"> ファイルを選択してください</span>
              </span>
              <span class="file-name"> {{ fileName != '' ? fileName : 'ファイル未選択' }} </span>
            </label>
          </div>

          <div class="mt-3">
            <div v-if="isConverting">変換中...</div>
          </div>

          <div class="field is-grouped mt-6">
            <div class="control">
              <button v-if="formData" class="button is-link" @click="handler.onSubmit">送信</button>
              <button v-else class="button is-link" disabled>送信</button>
            </div>
            <div class="control">
              <button class="button is-link is-light" @click="toLink('Main')">戻る</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <error-modal
    v-if="isErrorModal"
    :text="errorModalText"
    :on-close="handler.onErrorModalClose"
  ></error-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { excelToJson } from '../../api/excelToJson'

const router = useRouter()

const formData = ref(null)
const fileName = ref<string>('')
const permitFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const isConverting = ref(false)
//エラーモーダル
const isErrorModal = ref(false)
const errorModalText = ref('予期せぬエラーが発生しましました。')

//送信処理
const sendExcel = async () => {
  try {
    isConverting.value = true
    const result = await excelToJson(formData.value)
    //jsonData.value = result
    if (result) {
      download(result)
    } else {
      new Error()
    }
  } catch (e: any) {
    errorModalText.value = e.response
      ? e.response.data.message
      : '予期せぬエラーが発生しましました。'
    isErrorModal.value = true
  } finally {
    isConverting.value = false
    fileName.value = ''
    formData.value = null
  }
}

//ダウンロード
const download = (result: any) => {
  const blob = new Blob([JSON.stringify(result)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const pureFileName = fileName.value.replace('.xlsx', '')
  link.setAttribute('download', `${pureFileName}.json`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const toLink = (toLinkName: string) => {
  router.push({ name: toLinkName })
}

const handler = {
  onChange: (e: any) => {
    const file = e.target.files
    if (file[0].type != permitFileType) {
      errorModalText.value = 'エクセルファイルを選択してください。'
      isErrorModal.value = true
      fileName.value = ''
      formData.value = null
      return
    }
    fileName.value = file[0].name
    formData.value = file[0]
  },
  onSubmit: async () => {
    await sendExcel()
  },
  onErrorModalClose: () => {
    isErrorModal.value = false
  }
}
</script>

<style scope>
.textarea-height {
  height: 300px;
  overflow: scroll;
}

.table-cell-width-mediun {
  width: 50px;
}

.text-nowrap {
  white-space: nowrap;
}
</style>
