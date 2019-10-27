<template>
  <div id="app" class="app">
    <div class="app__dialog">
      <h1 class="app__title">Проверка услуг медицинского страхования</h1>
      <div class="app__inner">
        <div class="app__type-list">
          <span class="app__type"
                @click="!formSubmitted ? updateType(type) : ''"
                :class="{ 'app__type--active': type.id === currenttype.id }"
                v-for="type in policytypes" :key="type.id">
            {{ type.name }}
          </span>
        </div>
        <form action="" class="app__form form" @submit="submitForm">
          <div class="form__block form__row">
            <div class="form__block form__col app__form-policy">
              <input title="Номер полиса"
                     :disabled="formSubmitted"
                     type="text"
                     class="input"
                     @input="updatePolicy"
                     v-model="policynumber"
                     placeholder="Введите номер полиса">
              <p class="app__date-end" v-if="currentdate">Дата окончания {{ currentdate }}</p>
              <div class="form__error" v-if="policynumberError && formSubmitted">Номер полиса обязателен.</div>
            </div>
            <div class="form__block form__col app__form-company">
              <multiselect :disabled="formSubmitted"
                           v-model="currentcompany"
                           placeholder="Выберите страховую компанию"
                           label="title"
                           :options="companies"
                           :show-labels="false">
                <template slot="singleLabel" slot-scope="props">
                  <icon class="multiselect__img" :name="props.option.logo" />
                  {{ props.option.name }}
                </template>
                <template slot="option" slot-scope="props">
                  <icon class="multiselect__img" :name="props.option.logo" />
                  {{ props.option.name }}
                </template>
              </multiselect>
              <p class="app__phone" v-if="currentphone">Телефон {{ currentphone }}</p>
            </div>
          </div>
          <div class="form__block app__form-services">
            <label class="form__label">Выберите медицинские услуги</label>
            <multiselect @input="updateServices"
                         placeholder="Введите запрашиваемую услугу для пациента" :options="notChosenServices" :max-height="180" :show-labels="false">
              <template slot="singleLabel" slot-scope="props">
                {{ props.option.name }}
              </template>
              <template slot="option" slot-scope="props">
                {{ props.option.name }}
              </template>
            </multiselect>
            <div class="app__services-list" v-if="chosenServices.length > 0">
              <div class="services-item" v-for="service in chosenServices" :key="service.id" @click="updateSelected(service)">
                <icon class="services-item__status" :name="service.status === 'included' ? 'check' : 'stop'" v-if="service.status"></icon>
                {{ service.name }}
                <icon  class="services-item__close" name="close"></icon>
              </div>
            </div>
          </div>
          <div class="form__block app__form-btn-wrapper">
            <button type="submit" class="btn app__form-btn" :class="{ 'app__form-btn--submitted': formSubmitted }">
              {{ formSubmitted ? 'Повторный запрос' : 'Проверить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <modal
      @close="modal = !modal"
      :showModal="modal">
    </modal>
  </div>
</template>

<style src="./components/app.sass" lang="sass"></style>
<script src="./app.js"></script>
