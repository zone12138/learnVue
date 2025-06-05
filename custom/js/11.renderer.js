const { effect, ref } = VueReactivity;

const renderer = (domString, container) => {
  container.innerHTML = domString;
};

const count = ref(0);

effect(() => {
  renderer(`<h1>${count.value}</h1>`, document.getElementById("app"));
});

count.value++;
