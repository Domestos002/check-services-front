export default ({
  name: "modal",
  data() {
    return {
      body: document.querySelector("body"),
      signUp: true,
    }
  },

  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },


  methods: {
    closeClick() {
      this.$emit('close')
    },
    getScrollbarWidth() {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      const inner = document.createElement('div');
      outer.appendChild(inner);

      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

      outer.parentNode.removeChild(outer);

      return scrollbarWidth
    }
  },

  watch: {
    showModal: function (val) {
      if (val) {
        this.body.classList.add("body--modal");
        this.body.style.paddingRight = this.getScrollbarWidth() + 'px';
      } else {
        this.body.classList.remove("body--modal");
        this.body.style.paddingRight = '';
      }
    },
  },
});

