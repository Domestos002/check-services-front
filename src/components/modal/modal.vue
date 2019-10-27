<template>
    <div class="modal" v-if="showModal">
        <div class="modal__dialog">
            <p class="modal__title">
                Полис с таким <br/> номером не обнаружен
            </p>
            <p class="modal__subtitle">Попробуйте изменить данные</p>
            <div class="modal__btn-wrapper">
                <span class="btn modal__btn" @click="closeClick">Ок</span>
            </div>
        </div>
    </div>
</template>
<script src="./modal.js"></script>
<style src="./modal.sass" lang="sass"></style>
