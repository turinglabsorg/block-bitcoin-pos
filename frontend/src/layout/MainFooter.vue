<template>
    <footer class="footer"
            :class="{[`footer-${type}`]: type}"
            :data-background-color="backgroundColor">
        <div class="container">
            <div class="copyright col-12 text-center">
                &copy; {{year}}, Project by
                <a href="https:///turinglabs.org" target="_blank">TuringLabs</a>.
            </div>
            <div class="copyright col-12 text-center">
                Block! - The POS for the crypto era.
            </div>
        </div>
    </footer>
</template>
<script>
export default {
  props: {
    backgroundColor: String,
    type: String
  },
  data() {
    return {
      year: new Date().getFullYear()
    };
  }
};
</script>
<style>
</style>
