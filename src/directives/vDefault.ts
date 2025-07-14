const vHtml = {
    mounted(el: HTMLElement, binding: any) {
        el.innerHTML = binding;
    },
    updated(el: HTMLElement, binding: any) {
        el.innerHTML = binding;
    }
}

const vText = {
    mounted(el: HTMLElement, binding: any) {
        el.textContent = binding;
    },
    updated(el: HTMLElement, binding: any) {
        el.textContent = binding;
    }
}

const vShow = {
    mounted: (el:HTMLElement, binding: Boolean) => {
        el.style.display = binding ? 'block' : 'none'
    },
    updated: (el:HTMLElement, binding: Boolean) => {
        el.style.display = binding ? 'block' : 'none'
    }
}