<template>
  <div>
    <headers />
    <div uk-slideshow="draggable: false">
      <ul class="uk-slideshow-items">
        <li>
          <start />
        </li>
        <li>
          <start-auth />
        </li>
        <li>
          <start-design />
        </li>
        <li>
          <start-type />
        </li>
        <li>
          <start-option />
        </li>
        <li>
          <start-end />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import start from "../components/Setup/start";
import auth from "../components/Setup/auth";
import design from "../components/Setup/design";
import types from "../components/Setup/type";
import header from "../components/Setup/Header";
import option from "../components/Setup/option";
import end from "../components/Setup/end";
export default {
  components: {
    start: start,
    "start-auth": auth,
    "start-design": design,
    "start-type": types,
    headers: header,
    "start-option": option,
    "start-end": end
  }
};
</script>

<style></style>
