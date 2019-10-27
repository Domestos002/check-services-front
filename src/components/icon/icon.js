export default {
    name: 'svg-icon',

    props: {
        name: {
            type: String,
            required: true
        },

        title: {
            type: String,
            default: null
        }
    },

    computed: {
        iconPath() {
            return require(`@/assets/icons/${this.name}.svg`).default.url;
        },

        className() {
            return 'svg-icon svg-icon--' + this.name;
        }
    }
};
