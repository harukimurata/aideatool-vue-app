<template>
  <header-component title="TypeMatch"></header-component>
  <div class="columns is-mobile is-centered mx-0">
    <div class="column is-11 mt-3 mx-1">
      <div class="card">
        <div class="card-content">
          <p>自分のタイプ</p>
          <div v-for="attackSelectType in 2" class="select mb-4 mr-1">
            <select
              v-model.number="form.attackTypes[attackSelectType - 1]"
              :id="`attackSelectType-${attackSelectType}`"
              :name="`attackSelectType-${attackSelectType}`"
            >
              <option value="-">-</option>
              <option v-for="typeName in typeNames" :value="typeName.type">
                {{ typeName.typeName }}
              </option>
            </select>
          </div>
          <div class="columns is-mobile mb-0">
            <div class="column is-4">
              <h1 class="text-nowrap">技のタイプ</h1>
            </div>
            <div class="column is-4">
              <h1 class="text-nowrap">相手のタイプ</h1>
            </div>
            <div class="column is-4">
              <h1>相性</h1>
            </div>
          </div>
          <div class="columns is-mobile is-vcentered">
            <div class="column is-4">
              <div v-for="weaponType in 4" class="select my-3">
                <select
                  v-model.number="form.weaponTypes[weaponType - 1]"
                  :id="`weaponType-${weaponType}`"
                  :name="`weaponType-${weaponType}`"
                >
                  <option value="-">-</option>
                  <option v-for="typeName in typeNames" :value="typeName.type">
                    {{ typeName.typeName }}
                  </option>
                </select>
              </div>
            </div>
            <div class="column is-4">
              <div v-for="defenseSelectType in 2" class="select mb-1">
                <select
                  v-model.number="form.defenseTypes[defenseSelectType - 1]"
                  :id="`defenseSelectType-${defenseSelectType}`"
                  :name="`defenseSelectType-${defenseSelectType}`"
                >
                  <option value="-">-</option>
                  <option v-for="typeName in typeNames" :value="typeName.type">
                    {{ typeName.typeName }}
                  </option>
                </select>
              </div>
            </div>
            <div class="column is-4">
              <div v-for="weaponType in 4" class="mb-4">
                <p>
                  {{
                    typeCheckResult(
                      form.weaponTypes[weaponType - 1],
                      form.defenseTypes[0],
                      form.defenseTypes[1]
                    )[0]
                  }}
                </p>
                <p>
                  {{
                    `${
                      typeCheckResult(
                        form.weaponTypes[weaponType - 1],
                        form.defenseTypes[0],
                        form.defenseTypes[1]
                      )[1]
                    }倍`
                  }}
                </p>
              </div>
            </div>
          </div>
          <hr />
          <p>メインタイプ相性</p>
          <div class="columns is-mobile mb-0">
            <div class="column is-4">
              <h1 class="text-nowrap">相手のタイプ</h1>
              <p class="cell-height align-center">{{ getTypeName(form.defenseTypes[0]) }}</p>
              <p class="cell-height align-center">{{ getTypeName(form.defenseTypes[1]) }}</p>
            </div>
            <div class="column is-4">
              <h1 class="text-nowrap">自分のタイプ</h1>
              <div class="main-cell-height align-center">
                <p>{{ getTypeName(form.attackTypes[0]) }}</p>
                <p>{{ getTypeName(form.attackTypes[1]) }}</p>
              </div>
            </div>
            <div class="column is-4">
              <h1>相性</h1>
              <div class="cell-height align-center">
                <p>
                  {{
                    typeCheckResult(
                      form.defenseTypes[0],
                      form.attackTypes[0],
                      form.attackTypes[1]
                    )[0]
                  }}
                </p>
                <p>
                  {{
                    `${
                      typeCheckResult(
                        form.defenseTypes[0],
                        form.attackTypes[0],
                        form.attackTypes[1]
                      )[1]
                    }倍`
                  }}
                </p>
              </div>
              <div class="cell-height align-center">
                <p>
                  {{
                    typeCheckResult(
                      form.defenseTypes[1],
                      form.attackTypes[0],
                      form.attackTypes[1]
                    )[0]
                  }}
                </p>
                <p>
                  {{
                    `${
                      typeCheckResult(
                        form.defenseTypes[1],
                        form.attackTypes[0],
                        form.attackTypes[1]
                      )[1]
                    }倍`
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import typeNames from '@/views/TypeMatch/json/typeName.json'
import typeMachs from '@/views/TypeMatch/json/typeMatch.json'

const form = reactive({
  attackTypes: Array(2).fill(0),
  weaponTypes: Array(4).fill(0),
  defenseTypes: Array(2).fill(0)
})

const typeChecker = (attackType: number, defenseType: number): number => {
  for (const typeMach of typeMachs) {
    if (typeMach.type == attackType) {
      if (typeMach.super.includes(defenseType)) {
        return 2
      } else if (typeMach.notVery.includes(defenseType)) {
        return 0.5
      } else if (typeMach.noEffect.includes(defenseType)) {
        return 0
      } else if (typeMach.usually.includes(defenseType)) {
        return 1
      } else {
        return 1
      }
    }
  }

  return 1
}

const typeCheckResult = (
  attackType: number,
  defenseType1: number,
  defenseType2: number
): [string, number] => {
  const result = typeChecker(attackType, defenseType1) * typeChecker(attackType, defenseType2)

  switch (result) {
    case 0:
      return ['×', 0]
    case 0.25:
      return ['-△', 0.25]
    case 0.5:
      return ['△', 0.5]
    case 1:
      return ['-', 1]
    case 2:
      return ['○', 2]
    case 4:
      return ['☆', 4]

    default:
      return ['-', 1]
  }
}

const getTypeName = (type: number): string => {
  for (const typeName of typeNames) {
    if (typeName.type == type) {
      return typeName.typeName
    }
  }
  return '-'
}
</script>

<style scope>
.text-nowrap {
  white-space: nowrap;
}

.main-cell-height {
  height: 120px;
}

.cell-height {
  height: 60px;
}

.align-center {
  align-content: center;
}
</style>
