
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':25566/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Tooltip.svelte generated by Svelte v3.31.0 */

    const file = "src\\Tooltip.svelte";
    const get_tip_slot_changes = dirty => ({});
    const get_tip_slot_context = ctx => ({});

    function create_fragment(ctx) {
    	let div1;
    	let t;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const tip_slot_template = /*#slots*/ ctx[5].tip;
    	const tip_slot = create_slot(tip_slot_template, ctx, /*$$scope*/ ctx[4], get_tip_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div0 = element("div");
    			if (tip_slot) tip_slot.c();
    			attr_dev(div0, "class", "tip svelte-1v9lnqj");
    			toggle_class(div0, "left", /*left*/ ctx[1]);
    			toggle_class(div0, "right", /*right*/ ctx[2]);
    			toggle_class(div0, "top", /*top*/ ctx[3]);
    			toggle_class(div0, "bottom", /*bottom*/ ctx[0]);
    			add_location(div0, file, 12, 2, 276);
    			attr_dev(div1, "class", "content svelte-1v9lnqj");
    			add_location(div1, file, 8, 0, 198);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (tip_slot) {
    				tip_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (tip_slot) {
    				if (tip_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(tip_slot, tip_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_tip_slot_changes, get_tip_slot_context);
    				}
    			}

    			if (dirty & /*left*/ 2) {
    				toggle_class(div0, "left", /*left*/ ctx[1]);
    			}

    			if (dirty & /*right*/ 4) {
    				toggle_class(div0, "right", /*right*/ ctx[2]);
    			}

    			if (dirty & /*top*/ 8) {
    				toggle_class(div0, "top", /*top*/ ctx[3]);
    			}

    			if (dirty & /*bottom*/ 1) {
    				toggle_class(div0, "bottom", /*bottom*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(tip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(tip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (tip_slot) tip_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tooltip", slots, ['default','tip']);
    	let { left = false } = $$props;
    	let { right = false } = $$props;
    	let { top = false } = $$props;
    	let { bottom = false } = $$props;
    	if (!left && !right && !top && !bottom) bottom = true;
    	const writable_props = ["left", "right", "top", "bottom"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tooltip> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("left" in $$props) $$invalidate(1, left = $$props.left);
    		if ("right" in $$props) $$invalidate(2, right = $$props.right);
    		if ("top" in $$props) $$invalidate(3, top = $$props.top);
    		if ("bottom" in $$props) $$invalidate(0, bottom = $$props.bottom);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ left, right, top, bottom });

    	$$self.$inject_state = $$props => {
    		if ("left" in $$props) $$invalidate(1, left = $$props.left);
    		if ("right" in $$props) $$invalidate(2, right = $$props.right);
    		if ("top" in $$props) $$invalidate(3, top = $$props.top);
    		if ("bottom" in $$props) $$invalidate(0, bottom = $$props.bottom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bottom, left, right, top, $$scope, slots];
    }

    class Tooltip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { left: 1, right: 2, top: 3, bottom: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tooltip",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get left() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bottom() {
    		throw new Error("<Tooltip>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bottom(value) {
    		throw new Error("<Tooltip>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\AssessmentCard.svelte generated by Svelte v3.31.0 */
    const file$1 = "src\\AssessmentCard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[11] = list;
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (21:6) <p slot="tip">
    function create_tip_slot_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Delete Assessment";
    			attr_dev(p, "slot", "tip");
    			add_location(p, file$1, 20, 6, 526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tip_slot_1.name,
    		type: "slot",
    		source: "(21:6) <p slot=\\\"tip\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:4) <Tooltip left>
    function create_default_slot_1(ctx) {
    	let button;
    	let i;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			i.textContent = "clear";
    			t1 = space();
    			attr_dev(i, "class", "material-icons svelte-fe0g88");
    			add_location(i, file$1, 18, 8, 466);
    			attr_dev(button, "class", "delete svelte-fe0g88");
    			add_location(button, file$1, 17, 6, 424);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(17:4) <Tooltip left>",
    		ctx
    	});

    	return block;
    }

    // (47:10) <p slot="tip">
    function create_tip_slot(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Delete Grade";
    			attr_dev(p, "slot", "tip");
    			add_location(p, file$1, 46, 10, 1453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tip_slot.name,
    		type: "slot",
    		source: "(47:10) <p slot=\\\"tip\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:8) <Tooltip left>
    function create_default_slot(ctx) {
    	let button;
    	let i;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[7](/*i*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			i.textContent = "clear";
    			t1 = space();
    			attr_dev(i, "class", "material-icons svelte-fe0g88");
    			add_location(i, file$1, 45, 15, 1397);
    			attr_dev(button, "class", "delete svelte-fe0g88");
    			add_location(button, file$1, 41, 10, 1208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(41:8) <Tooltip left>",
    		ctx
    	});

    	return block;
    }

    // (36:4) {#each assessment.grades as grade, i (grade.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let input0;
    	let t0;
    	let p;
    	let t2;
    	let input1;
    	let t3;
    	let tooltip;
    	let div_transition;
    	let current;
    	let mounted;
    	let dispose;

    	function input0_input_handler_1() {
    		/*input0_input_handler_1*/ ctx[5].call(input0, /*each_value*/ ctx[11], /*i*/ ctx[12]);
    	}

    	function input1_input_handler_1() {
    		/*input1_input_handler_1*/ ctx[6].call(input1, /*each_value*/ ctx[11], /*i*/ ctx[12]);
    	}

    	tooltip = new Tooltip({
    			props: {
    				left: true,
    				$$slots: {
    					default: [create_default_slot],
    					tip: [create_tip_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t0 = space();
    			p = element("p");
    			p.textContent = "/";
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			create_component(tooltip.$$.fragment);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "step", "any");
    			attr_dev(input0, "class", "svelte-fe0g88");
    			add_location(input0, file$1, 37, 8, 1005);
    			attr_dev(p, "class", "slash svelte-fe0g88");
    			add_location(p, file$1, 38, 8, 1073);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "1");
    			attr_dev(input1, "step", "any");
    			attr_dev(input1, "class", "svelte-fe0g88");
    			add_location(input1, file$1, 39, 8, 1105);
    			attr_dev(div, "class", "hbox svelte-fe0g88");
    			add_location(div, file$1, 36, 6, 940);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			set_input_value(input0, /*grade*/ ctx[10].mark);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(div, t2);
    			append_dev(div, input1);
    			set_input_value(input1, /*grade*/ ctx[10].total);
    			append_dev(div, t3);
    			mount_component(tooltip, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", input0_input_handler_1),
    					listen_dev(input1, "input", input1_input_handler_1)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*assessment*/ 1 && to_number(input0.value) !== /*grade*/ ctx[10].mark) {
    				set_input_value(input0, /*grade*/ ctx[10].mark);
    			}

    			if (dirty & /*assessment*/ 1 && to_number(input1.value) !== /*grade*/ ctx[10].total) {
    				set_input_value(input1, /*grade*/ ctx[10].total);
    			}

    			const tooltip_changes = {};

    			if (dirty & /*$$scope, assessment*/ 8193) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, slide, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tooltip);
    			if (detaching && div_transition) div_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(36:4) {#each assessment.grades as grade, i (grade.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let form;
    	let div0;
    	let input0;
    	let t0;
    	let tooltip;
    	let t1;
    	let p0;
    	let t3;
    	let div2;
    	let input1;
    	let t4;
    	let div1;
    	let t5;
    	let p1;
    	let t7;
    	let div3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t8;
    	let button;
    	let form_transition;
    	let current;
    	let mounted;
    	let dispose;

    	tooltip = new Tooltip({
    			props: {
    				left: true,
    				$$slots: {
    					default: [create_default_slot_1],
    					tip: [create_tip_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*assessment*/ ctx[0].grades;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*grade*/ ctx[10].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			form = element("form");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			create_component(tooltip.$$.fragment);
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Assessment Weight (%):";
    			t3 = space();
    			div2 = element("div");
    			input1 = element("input");
    			t4 = space();
    			div1 = element("div");
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "Grades:";
    			t7 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			button = element("button");
    			button.textContent = "Add Grade";
    			attr_dev(input0, "class", "name svelte-fe0g88");
    			attr_dev(input0, "placeholder", "Assessment Name...");
    			add_location(input0, file$1, 12, 4, 291);
    			attr_dev(div0, "class", "hbox svelte-fe0g88");
    			add_location(div0, file$1, 11, 2, 267);
    			attr_dev(p0, "class", "label svelte-fe0g88");
    			add_location(p0, file$1, 23, 2, 591);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "100");
    			attr_dev(input1, "step", "any");
    			attr_dev(input1, "class", "svelte-fe0g88");
    			add_location(input1, file$1, 25, 4, 662);
    			set_style(div1, "width", "40px");
    			add_location(div1, file$1, 31, 4, 786);
    			attr_dev(div2, "class", "hbox svelte-fe0g88");
    			add_location(div2, file$1, 24, 2, 638);
    			attr_dev(p1, "class", "label svelte-fe0g88");
    			add_location(p1, file$1, 33, 2, 826);
    			attr_dev(button, "class", "add svelte-fe0g88");
    			add_location(button, file$1, 50, 4, 1536);
    			attr_dev(div3, "class", "grades svelte-fe0g88");
    			add_location(div3, file$1, 34, 2, 858);
    			attr_dev(form, "class", "content svelte-fe0g88");
    			add_location(form, file$1, 7, 0, 159);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div0);
    			append_dev(div0, input0);
    			set_input_value(input0, /*assessment*/ ctx[0].name);
    			append_dev(div0, t0);
    			mount_component(tooltip, div0, null);
    			append_dev(form, t1);
    			append_dev(form, p0);
    			append_dev(form, t3);
    			append_dev(form, div2);
    			append_dev(div2, input1);
    			set_input_value(input1, /*assessment*/ ctx[0].weight);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(form, t5);
    			append_dev(form, p1);
    			append_dev(form, t7);
    			append_dev(form, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t8);
    			append_dev(div3, button);
    			/*button_binding*/ ctx[8](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[9], false, false, false),
    					listen_dev(form, "submit", prevent_default(submit_handler), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*assessment*/ 1 && input0.value !== /*assessment*/ ctx[0].name) {
    				set_input_value(input0, /*assessment*/ ctx[0].name);
    			}

    			const tooltip_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);

    			if (dirty & /*assessment*/ 1 && to_number(input1.value) !== /*assessment*/ ctx[0].weight) {
    				set_input_value(input1, /*assessment*/ ctx[0].weight);
    			}

    			if (dirty & /*assessment*/ 1) {
    				const each_value = /*assessment*/ ctx[0].grades;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block, t8, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!form_transition) form_transition = create_bidirectional_transition(form, slide, { duration: 200 }, true);
    				form_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!form_transition) form_transition = create_bidirectional_transition(form, slide, { duration: 200 }, false);
    			form_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(tooltip);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*button_binding*/ ctx[8](null);
    			if (detaching && form_transition) form_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const submit_handler = () => {
    	
    };

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AssessmentCard", slots, []);
    	
    	let { assessment } = $$props;
    	let addButton;
    	const writable_props = ["assessment"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AssessmentCard> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function input0_input_handler() {
    		assessment.name = this.value;
    		$$invalidate(0, assessment);
    	}

    	function input1_input_handler() {
    		assessment.weight = to_number(this.value);
    		$$invalidate(0, assessment);
    	}

    	function input0_input_handler_1(each_value, i) {
    		each_value[i].mark = to_number(this.value);
    		$$invalidate(0, assessment);
    	}

    	function input1_input_handler_1(each_value, i) {
    		each_value[i].total = to_number(this.value);
    		$$invalidate(0, assessment);
    	}

    	const click_handler_1 = i => {
    		$$invalidate(0, assessment.grades = [...assessment.grades.slice(0, i), ...assessment.grades.slice(i + 1)], assessment);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			addButton = $$value;
    			$$invalidate(1, addButton);
    		});
    	}

    	const click_handler_2 = () => {
    		$$invalidate(
    			0,
    			assessment.grades = [
    				...assessment.grades,
    				{
    					mark: 0,
    					total: 100,
    					id: Date.now().toString()
    				}
    			],
    			assessment
    		);

    		setTimeout(
    			() => {
    				addButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    			},
    			300
    		);
    	};

    	$$self.$$set = $$props => {
    		if ("assessment" in $$props) $$invalidate(0, assessment = $$props.assessment);
    	};

    	$$self.$capture_state = () => ({ Tooltip, slide, assessment, addButton });

    	$$self.$inject_state = $$props => {
    		if ("assessment" in $$props) $$invalidate(0, assessment = $$props.assessment);
    		if ("addButton" in $$props) $$invalidate(1, addButton = $$props.addButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		assessment,
    		addButton,
    		click_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input0_input_handler_1,
    		input1_input_handler_1,
    		click_handler_1,
    		button_binding,
    		click_handler_2
    	];
    }

    class AssessmentCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { assessment: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AssessmentCard",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*assessment*/ ctx[0] === undefined && !("assessment" in props)) {
    			console.warn("<AssessmentCard> was created without expected prop 'assessment'");
    		}
    	}

    	get assessment() {
    		throw new Error("<AssessmentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set assessment(value) {
    		throw new Error("<AssessmentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let data = localStorage.getItem("courses");
    let profs = data ? JSON.parse(data) : [];
    data = localStorage.getItem("currentCourse");
    let curProf = data ? JSON.parse(data) : 0;
    const courses = writable(profs);
    const currentCourse = writable(curProf);
    courses.subscribe(data => { localStorage.setItem("courses", JSON.stringify(data)); });
    currentCourse.subscribe(data => { localStorage.setItem("currentCourse", JSON.stringify(data)); });

    /* src\Calculator.svelte generated by Svelte v3.31.0 */
    const file$2 = "src\\Calculator.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[15] = list;
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (77:2) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let i;
    	let t1;
    	let h2;
    	let t3;
    	let p;
    	let t5;
    	let button;
    	let div1_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			i.textContent = "widgets";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "No Courses Yet";
    			t3 = space();
    			p = element("p");
    			p.textContent = "Fortunately, it is very easy to add new ones.";
    			t5 = space();
    			button = element("button");
    			button.textContent = "Add Course";
    			attr_dev(i, "class", "material-icons md-120 svelte-4s8qjl");
    			add_location(i, file$2, 78, 26, 3057);
    			attr_dev(div0, "class", "circle svelte-4s8qjl");
    			add_location(div0, file$2, 78, 6, 3037);
    			attr_dev(h2, "class", "svelte-4s8qjl");
    			add_location(h2, file$2, 79, 6, 3115);
    			attr_dev(p, "class", "empty-state svelte-4s8qjl");
    			add_location(p, file$2, 80, 6, 3146);
    			attr_dev(button, "class", "message svelte-4s8qjl");
    			attr_dev(button, "type", "button");
    			add_location(button, file$2, 81, 6, 3226);
    			attr_dev(div1, "class", "empty svelte-4s8qjl");
    			add_location(div1, file$2, 77, 4, 2974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div1, t1);
    			append_dev(div1, h2);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(div1, t5);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 200 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 200 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(77:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#if $courses.length > 0}
    function create_if_block(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let tooltip;
    	let div0_transition;
    	let t1;
    	let p;
    	let t2;

    	let t3_value = (/*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].mark
    	? `${/*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].mark}%`
    	: "") + "";

    	let t3;
    	let p_transition;
    	let t4;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t5;
    	let div1;
    	let button;
    	let div2_resize_listener;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;

    	tooltip = new Tooltip({
    			props: {
    				left: true,
    				$$slots: {
    					default: [create_default_slot$1],
    					tip: [create_tip_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].assessments;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*assessment*/ ctx[14].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			create_component(tooltip.$$.fragment);
    			t1 = space();
    			p = element("p");
    			t2 = text("GRADE:\r\n      ");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Add Assessment";
    			attr_dev(input, "class", "course svelte-4s8qjl");
    			add_location(input, file$2, 25, 6, 863);
    			attr_dev(div0, "class", "title svelte-4s8qjl");
    			add_location(div0, file$2, 24, 4, 800);
    			attr_dev(p, "class", "grade svelte-4s8qjl");
    			add_location(p, file$2, 44, 4, 1614);
    			attr_dev(button, "class", "add svelte-4s8qjl");
    			add_location(button, file$2, 62, 8, 2405);
    			attr_dev(div1, "class", "add-wrapper svelte-4s8qjl");
    			add_location(div1, file$2, 61, 6, 2370);
    			attr_dev(div2, "class", "grades svelte-4s8qjl");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[11].call(div2));
    			toggle_class(div2, "scrollbar", !(/*gradesDiv*/ ctx[3] && /*gradesDiv*/ ctx[3].scrollHeight > /*gradesDivHeight*/ ctx[2]));
    			add_location(div2, file$2, 48, 4, 1779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			set_input_value(input, /*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].name);
    			append_dev(div0, t0);
    			mount_component(tooltip, div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			/*button_binding*/ ctx[9](button);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[11].bind(div2));
    			/*div2_binding*/ ctx[12](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$courses, $currentCourse*/ 3 && input.value !== /*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].name) {
    				set_input_value(input, /*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].name);
    			}

    			const tooltip_changes = {};

    			if (dirty & /*$$scope, $courses, $currentCourse*/ 131075) {
    				tooltip_changes.$$scope = { dirty, ctx };
    			}

    			tooltip.$set(tooltip_changes);

    			if ((!current || dirty & /*$courses, $currentCourse*/ 3) && t3_value !== (t3_value = (/*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].mark
    			? `${/*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].mark}%`
    			: "") + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*$courses, $currentCourse*/ 3) {
    				const each_value = /*$courses*/ ctx[0][/*$currentCourse*/ ctx[1]].assessments;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, outro_and_destroy_block, create_each_block$1, t5, get_each_context$1);
    				check_outros();
    			}

    			if (dirty & /*gradesDiv, gradesDivHeight*/ 12) {
    				toggle_class(div2, "scrollbar", !(/*gradesDiv*/ ctx[3] && /*gradesDiv*/ ctx[3].scrollHeight > /*gradesDivHeight*/ ctx[2]));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 200 }, true);
    				div0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 200 }, true);
    				p_transition.run(1);
    			});

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 200 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip.$$.fragment, local);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 200 }, false);
    			div0_transition.run(0);
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 200 }, false);
    			p_transition.run(0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 200 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(tooltip);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*button_binding*/ ctx[9](null);
    			div2_resize_listener();
    			/*div2_binding*/ ctx[12](null);
    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:2) {#if $courses.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (42:8) <p slot="tip">
    function create_tip_slot$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Delete Course";
    			attr_dev(p, "slot", "tip");
    			add_location(p, file$2, 41, 8, 1547);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_tip_slot$1.name,
    		type: "slot",
    		source: "(42:8) <p slot=\\\"tip\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:6) <Tooltip left>
    function create_default_slot$1(ctx) {
    	let button;
    	let i;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			i.textContent = "delete";
    			t1 = space();
    			attr_dev(i, "class", "material-icons svelte-4s8qjl");
    			add_location(i, file$2, 39, 10, 1482);
    			attr_dev(button, "class", "action svelte-4s8qjl");
    			add_location(button, file$2, 33, 8, 1177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:6) <Tooltip left>",
    		ctx
    	});

    	return block;
    }

    // (55:6) {#each $courses[$currentCourse].assessments as assessment, i (assessment.id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let assessmentcard;
    	let updating_assessment;
    	let current;

    	function assessmentcard_assessment_binding(value) {
    		/*assessmentcard_assessment_binding*/ ctx[7].call(null, value, /*assessment*/ ctx[14], /*each_value*/ ctx[15], /*i*/ ctx[16]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*i*/ ctx[16]);
    	}

    	let assessmentcard_props = {};

    	if (/*assessment*/ ctx[14] !== void 0) {
    		assessmentcard_props.assessment = /*assessment*/ ctx[14];
    	}

    	assessmentcard = new AssessmentCard({
    			props: assessmentcard_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(assessmentcard, "assessment", assessmentcard_assessment_binding));
    	assessmentcard.$on("click", click_handler_1);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(assessmentcard.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(assessmentcard, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const assessmentcard_changes = {};

    			if (!updating_assessment && dirty & /*$courses, $currentCourse*/ 3) {
    				updating_assessment = true;
    				assessmentcard_changes.assessment = /*assessment*/ ctx[14];
    				add_flush_callback(() => updating_assessment = false);
    			}

    			assessmentcard.$set(assessmentcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(assessmentcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(assessmentcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(assessmentcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(55:6) {#each $courses[$currentCourse].assessments as assessment, i (assessment.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$courses*/ ctx[0].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "wrapper svelte-4s8qjl");
    			add_location(div, file$2, 22, 0, 744);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $courses;
    	let $currentCourse;
    	validate_store(courses, "courses");
    	component_subscribe($$self, courses, $$value => $$invalidate(0, $courses = $$value));
    	validate_store(currentCourse, "currentCourse");
    	component_subscribe($$self, currentCourse, $$value => $$invalidate(1, $currentCourse = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Calculator", slots, []);
    	let gradesDivHeight = 0;
    	let gradesDiv;
    	let addButton;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Calculator> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$courses[$currentCourse].name = this.value;
    		courses.set($courses);
    	}

    	const click_handler = () => {
    		set_store_value(courses, $courses = [...$courses.slice(0, $currentCourse), ...$courses.slice($currentCourse + 1)], $courses);
    		if ($currentCourse >= $courses.length && $courses.length > 0) set_store_value(currentCourse, $currentCourse = $courses.length - 1, $currentCourse);
    	};

    	function assessmentcard_assessment_binding(value, assessment, each_value, i) {
    		each_value[i] = value;
    		courses.set($courses);
    	}

    	const click_handler_1 = i => {
    		set_store_value(
    			courses,
    			$courses[$currentCourse].assessments = [
    				...$courses[$currentCourse].assessments.slice(0, i),
    				...$courses[$currentCourse].assessments.slice(i + 1)
    			],
    			$courses
    		);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			addButton = $$value;
    			$$invalidate(4, addButton);
    		});
    	}

    	const click_handler_2 = () => {
    		set_store_value(
    			courses,
    			$courses[$currentCourse].assessments = [
    				...$courses[$currentCourse].assessments,
    				{
    					name: "",
    					grades: [
    						{
    							mark: 0,
    							total: 100,
    							id: Date.now().toString()
    						}
    					],
    					weight: 0,
    					id: Date.now().toString()
    				}
    			],
    			$courses
    		);

    		setTimeout(
    			() => {
    				addButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    			},
    			300
    		);
    	};

    	function div2_elementresize_handler() {
    		gradesDivHeight = this.clientHeight;
    		$$invalidate(2, gradesDivHeight);
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gradesDiv = $$value;
    			$$invalidate(3, gradesDiv);
    		});
    	}

    	const click_handler_3 = () => {
    		set_store_value(
    			courses,
    			$courses = [
    				...$courses,
    				{
    					name: "Course Name",
    					assessments: [],
    					mark: 0,
    					id: Date.now().toString()
    				}
    			],
    			$courses
    		);
    	};

    	$$self.$capture_state = () => ({
    		AssessmentCard,
    		currentCourse,
    		courses,
    		Tooltip,
    		fade,
    		fly,
    		slide,
    		gradesDivHeight,
    		gradesDiv,
    		addButton,
    		$courses,
    		$currentCourse
    	});

    	$$self.$inject_state = $$props => {
    		if ("gradesDivHeight" in $$props) $$invalidate(2, gradesDivHeight = $$props.gradesDivHeight);
    		if ("gradesDiv" in $$props) $$invalidate(3, gradesDiv = $$props.gradesDiv);
    		if ("addButton" in $$props) $$invalidate(4, addButton = $$props.addButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$courses, $currentCourse*/ 3) {
    			 if ($courses.length > 0) {
    				let avg = 0;

    				for (const assessment of $courses[$currentCourse].assessments) {
    					for (const grade of assessment.grades) {
    						avg += assessment.weight / 100 * grade.mark / grade.total / assessment.grades.length;
    					}
    				}

    				set_store_value(courses, $courses[$currentCourse].mark = Math.round((avg * 100 + Number.EPSILON) * 100) / 100, $courses);
    			}
    		}
    	};

    	return [
    		$courses,
    		$currentCourse,
    		gradesDivHeight,
    		gradesDiv,
    		addButton,
    		input_input_handler,
    		click_handler,
    		assessmentcard_assessment_binding,
    		click_handler_1,
    		button_binding,
    		click_handler_2,
    		div2_elementresize_handler,
    		div2_binding,
    		click_handler_3
    	];
    }

    class Calculator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calculator",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Hamburger.svelte generated by Svelte v3.31.0 */

    const file$3 = "src\\Hamburger.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let svg;
    	let line0;
    	let line1;
    	let line2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			line0 = svg_element("line");
    			line1 = svg_element("line");
    			line2 = svg_element("line");
    			attr_dev(line0, "id", "top");
    			attr_dev(line0, "x1", "0");
    			attr_dev(line0, "y1", "2");
    			attr_dev(line0, "x2", "32");
    			attr_dev(line0, "y2", "2");
    			attr_dev(line0, "class", "svelte-18t2dyg");
    			add_location(line0, file$3, 9, 4, 242);
    			attr_dev(line1, "id", "middle");
    			attr_dev(line1, "x1", "0");
    			attr_dev(line1, "y1", "12");
    			attr_dev(line1, "x2", "32");
    			attr_dev(line1, "y2", "12");
    			attr_dev(line1, "class", "svelte-18t2dyg");
    			add_location(line1, file$3, 10, 4, 294);
    			attr_dev(line2, "id", "bottom");
    			attr_dev(line2, "x1", "0");
    			attr_dev(line2, "y1", "22");
    			attr_dev(line2, "x2", "32");
    			attr_dev(line2, "y2", "22");
    			attr_dev(line2, "class", "svelte-18t2dyg");
    			add_location(line2, file$3, 11, 4, 351);
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "class", "svelte-18t2dyg");
    			add_location(svg, file$3, 8, 2, 208);
    			attr_dev(button, "class", "text-gray-500 hover:text-gray-700 cursor-pointer mr-4 border-none focus:outline-none svelte-18t2dyg");
    			toggle_class(button, "open", /*open*/ ctx[0]);
    			add_location(button, file$3, 4, 0, 51);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, line0);
    			append_dev(svg, line1);
    			append_dev(svg, line2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*open*/ 1) {
    				toggle_class(button, "open", /*open*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Hamburger", slots, []);
    	let { open = false } = $$props;
    	const writable_props = ["open"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hamburger> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, open = !open);

    	$$self.$$set = $$props => {
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({ open });

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [open, click_handler];
    }

    class Hamburger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hamburger",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get open() {
    		throw new Error("<Hamburger>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Hamburger>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Sidebar.svelte generated by Svelte v3.31.0 */
    const file$4 = "src\\Sidebar.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (53:4) {#each $courses as course, i (course.id)}
    function create_each_block$2(key_1, ctx) {
    	let button;
    	let p0;
    	let t0_value = /*course*/ ctx[9].name + "";
    	let t0;
    	let t1;
    	let p1;

    	let t2_value = (/*course*/ ctx[9].mark
    	? `${/*course*/ ctx[9].mark}%`
    	: "") + "";

    	let t2;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[11]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			button = element("button");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			attr_dev(p0, "class", "name svelte-9wl9sl");
    			add_location(p0, file$4, 61, 8, 1725);
    			attr_dev(p1, "class", "mark");
    			add_location(p1, file$4, 62, 8, 1768);
    			attr_dev(button, "class", "course svelte-9wl9sl");
    			toggle_class(button, "selected", /*$currentCourse*/ ctx[5] === /*i*/ ctx[11]);
    			add_location(button, file$4, 53, 6, 1495);
    			this.first = button;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, p0);
    			append_dev(p0, t0);
    			append_dev(button, t1);
    			append_dev(button, p1);
    			append_dev(p1, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$courses*/ 8) && t0_value !== (t0_value = /*course*/ ctx[9].name + "")) set_data_dev(t0, t0_value);

    			if ((!current || dirty & /*$courses*/ 8) && t2_value !== (t2_value = (/*course*/ ctx[9].mark
    			? `${/*course*/ ctx[9].mark}%`
    			: "") + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$currentCourse, $courses*/ 40) {
    				toggle_class(button, "selected", /*$currentCourse*/ ctx[5] === /*i*/ ctx[11]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(button, slide, { duration: 200 }, true);
    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(button, slide, { duration: 200 }, false);
    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(53:4) {#each $courses as course, i (course.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div1;
    	let p0;
    	let t0;
    	let t1_value = /*$courses*/ ctx[3].length + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3;

    	let t4_value = (/*gpa*/ ctx[2] || /*gpa*/ ctx[2] === 0
    	? /*gpa*/ ctx[2]
    	: "") + "";

    	let t4;
    	let t5;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t6;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$courses*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*course*/ ctx[9].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p0 = element("p");
    			t0 = text("Courses: ");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text("GPA: ");
    			t4 = text(t4_value);
    			t5 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			button = element("button");
    			button.textContent = "Add Course";
    			attr_dev(p0, "class", "title svelte-9wl9sl");
    			add_location(p0, file$4, 49, 2, 1312);
    			attr_dev(p1, "class", "gpa svelte-9wl9sl");
    			add_location(p1, file$4, 50, 2, 1363);
    			attr_dev(button, "class", "add-course svelte-9wl9sl");
    			attr_dev(button, "type", "button");
    			add_location(button, file$4, 65, 4, 1862);
    			attr_dev(div0, "class", "scroll svelte-9wl9sl");
    			add_location(div0, file$4, 51, 2, 1420);
    			attr_dev(div1, "class", "wrapper svelte-9wl9sl");
    			set_style(div1, "width", (/*open*/ ctx[0] || !/*mobile*/ ctx[1] ? 100 : 0) + "%");
    			toggle_class(div1, "mobile", /*mobile*/ ctx[1]);
    			add_location(div1, file$4, 48, 0, 1230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t6);
    			append_dev(div0, button);
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*$courses*/ 8) && t1_value !== (t1_value = /*$courses*/ ctx[3].length + "")) set_data_dev(t1, t1_value);

    			if ((!current || dirty & /*gpa*/ 4) && t4_value !== (t4_value = (/*gpa*/ ctx[2] || /*gpa*/ ctx[2] === 0
    			? /*gpa*/ ctx[2]
    			: "") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*$currentCourse, $courses, open*/ 41) {
    				const each_value = /*$courses*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, outro_and_destroy_block, create_each_block$2, t6, get_each_context$2);
    				check_outros();
    			}

    			if (!current || dirty & /*open, mobile*/ 3) {
    				set_style(div1, "width", (/*open*/ ctx[0] || !/*mobile*/ ctx[1] ? 100 : 0) + "%");
    			}

    			if (dirty & /*mobile*/ 2) {
    				toggle_class(div1, "mobile", /*mobile*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $courses;
    	let $currentCourse;
    	validate_store(courses, "courses");
    	component_subscribe($$self, courses, $$value => $$invalidate(3, $courses = $$value));
    	validate_store(currentCourse, "currentCourse");
    	component_subscribe($$self, currentCourse, $$value => $$invalidate(5, $currentCourse = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	let { mobile = false } = $$props;
    	let { open = false } = $$props;
    	let addButton;
    	let gpa = 0;
    	const writable_props = ["mobile", "open"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => {
    		set_store_value(currentCourse, $currentCourse = i, $currentCourse);
    		$$invalidate(0, open = false);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			addButton = $$value;
    			$$invalidate(4, addButton);
    		});
    	}

    	const click_handler_1 = () => {
    		set_store_value(
    			courses,
    			$courses = [
    				...$courses,
    				{
    					name: "Course Name",
    					assessments: [],
    					mark: 0,
    					id: Date.now().toString()
    				}
    			],
    			$courses
    		);

    		setTimeout(
    			() => {
    				addButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    			},
    			300
    		);
    	};

    	$$self.$$set = $$props => {
    		if ("mobile" in $$props) $$invalidate(1, mobile = $$props.mobile);
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({
    		currentCourse,
    		courses,
    		slide,
    		mobile,
    		open,
    		addButton,
    		gpa,
    		$courses,
    		$currentCourse
    	});

    	$$self.$inject_state = $$props => {
    		if ("mobile" in $$props) $$invalidate(1, mobile = $$props.mobile);
    		if ("open" in $$props) $$invalidate(0, open = $$props.open);
    		if ("addButton" in $$props) $$invalidate(4, addButton = $$props.addButton);
    		if ("gpa" in $$props) $$invalidate(2, gpa = $$props.gpa);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			 document.body.classList.toggle("noscroll", open);
    		}

    		if ($$self.$$.dirty & /*$courses, gpa*/ 12) {
    			 {
    				$$invalidate(2, gpa = 0);

    				for (const course of $courses) {
    					if (course.mark >= 85) {
    						$$invalidate(2, gpa += 4);
    					} else if (course.mark >= 80) {
    						$$invalidate(2, gpa += 3.7);
    					} else if (course.mark >= 77) {
    						$$invalidate(2, gpa += 3.3);
    					} else if (course.mark >= 73) {
    						$$invalidate(2, gpa += 3);
    					} else if (course.mark >= 70) {
    						$$invalidate(2, gpa += 2.7);
    					} else if (course.mark >= 67) {
    						$$invalidate(2, gpa += 2.3);
    					} else if (course.mark >= 63) {
    						$$invalidate(2, gpa += 2);
    					} else if (course.mark >= 60) {
    						$$invalidate(2, gpa += 1.7);
    					} else if (course.mark >= 57) {
    						$$invalidate(2, gpa += 1.3);
    					} else if (course.mark >= 53) {
    						$$invalidate(2, gpa += 1);
    					} else if (course.mark >= 50) {
    						$$invalidate(2, gpa += 0.7);
    					}
    				}

    				$$invalidate(2, gpa = Math.floor((gpa / $courses.length + Number.EPSILON) * 100) / 100);
    			}
    		}
    	};

    	return [
    		open,
    		mobile,
    		gpa,
    		$courses,
    		addButton,
    		$currentCourse,
    		click_handler,
    		button_binding,
    		click_handler_1
    	];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { mobile: 1, open: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get mobile() {
    		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mobile(value) {
    		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\logo.svg generated by Svelte v3.31.0 */

    function create_fragment$5(ctx) {
    	let svg;
    	let defs;
    	let title;
    	let t;
    	let g1;
    	let g0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 125.03 28.14" },
    		/*$$props*/ ctx[0]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	return {
    		c() {
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			title = svg_element("title");
    			t = text("Asset 1");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			this.h();
    		},
    		l(nodes) {
    			svg = claim_element(nodes, "svg", { xmlns: true, viewBox: true }, 1);
    			var svg_nodes = children(svg);
    			defs = claim_element(svg_nodes, "defs", {}, 1);
    			children(defs).forEach(detach);
    			title = claim_element(svg_nodes, "title", {}, 1);
    			var title_nodes = children(title);
    			t = claim_text(title_nodes, "Asset 1");
    			title_nodes.forEach(detach);
    			g1 = claim_element(svg_nodes, "g", { id: true, "data-name": true }, 1);
    			var g1_nodes = children(g1);
    			g0 = claim_element(g1_nodes, "g", { id: true, "data-name": true }, 1);
    			var g0_nodes = children(g0);
    			path0 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path0).forEach(detach);
    			path1 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path1).forEach(detach);
    			path2 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path2).forEach(detach);
    			path3 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path3).forEach(detach);
    			path4 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path4).forEach(detach);
    			path5 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path5).forEach(detach);
    			path6 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path6).forEach(detach);
    			path7 = claim_element(g0_nodes, "path", { class: true, d: true }, 1);
    			children(path7).forEach(detach);
    			g0_nodes.forEach(detach);
    			g1_nodes.forEach(detach);
    			svg_nodes.forEach(detach);
    			this.h();
    		},
    		h() {
    			attr(path0, "class", "cls-1");
    			attr(path0, "d", "M15.48,14.48c0,5.21-2.73,8.5-6.85,8.5a5.61,5.61,0,0,1-5.18-3H3.38v8.14H0V6.27H3.27V9.09h.06A5.69,5.69,0,0,1,8.56,6C12.73,6,15.48,9.28,15.48,14.48Zm-3.46,0c0-3.43-1.68-5.64-4.35-5.64s-4.31,2.25-4.31,5.64,1.72,5.65,4.31,5.65S12,17.94,12,14.48Z");
    			attr(path1, "class", "cls-1");
    			attr(path1, "d", "M17.92,1.94a2,2,0,0,1,3.92,0,2,2,0,0,1-3.92,0Zm.27,4.33h3.37V22.7H18.19Z");
    			attr(path2, "class", "cls-1");
    			attr(path2, "d", "M25,6.27h3.21V9h.08a5.34,5.34,0,0,1,5.17-3c3.63,0,5.71,2.32,5.71,6.08V22.7H35.8v-10c0-2.47-1.16-3.83-3.5-3.83s-3.91,1.69-3.91,4.24V22.7H25Z");
    			attr(path3, "class", "cls-1");
    			attr(path3, "d", "M56.53,17.88c-.47,3-3.31,5.14-7.08,5.14-4.82,0-7.75-3.27-7.75-8.46S44.67,6,49.31,6s7.41,3.22,7.41,8.2v1.16H45.11v.2c0,2.86,1.72,4.75,4.42,4.75a3.73,3.73,0,0,0,3.8-2.4ZM45.13,13h8.21c-.07-2.52-1.67-4.28-4-4.28S45.3,10.48,45.13,13Z");
    			attr(path4, "class", "cls-1");
    			attr(path4, "d", "M70.22,11.92a3.73,3.73,0,0,0-3.86-3.14C63.75,8.78,62,11,62,14.48s1.74,5.71,4.36,5.71a3.61,3.61,0,0,0,3.83-3.05h3.25c-.36,3.5-3.16,5.88-7.11,5.88-4.7,0-7.77-3.22-7.77-8.54S61.66,6,66.33,6c4.23,0,6.81,2.72,7.11,6Z");
    			attr(path5, "class", "cls-1");
    			attr(path5, "d", "M75.13,14.48C75.13,9.2,78.23,6,82.92,6s7.8,3.23,7.8,8.51S87.63,23,82.92,23,75.13,19.78,75.13,14.48Zm12.15,0c0-3.64-1.72-5.73-4.36-5.73s-4.36,2.09-4.36,5.73,1.72,5.75,4.36,5.75S87.28,18.14,87.28,14.48Z");
    			attr(path6, "class", "cls-1");
    			attr(path6, "d", "M93.33,6.27h3.22V9h.08a5.34,5.34,0,0,1,5.17-3c3.62,0,5.7,2.32,5.7,6.08V22.7h-3.39v-10c0-2.47-1.16-3.83-3.5-3.83s-3.91,1.69-3.91,4.24V22.7H93.33Z");
    			attr(path7, "class", "cls-1");
    			attr(path7, "d", "M124.84,17.88c-.46,3-3.31,5.14-7.07,5.14-4.83,0-7.75-3.27-7.75-8.46S113,6,117.63,6s7.4,3.22,7.4,8.2v1.16H113.42v.2c0,2.86,1.72,4.75,4.42,4.75a3.72,3.72,0,0,0,3.8-2.4ZM113.44,13h8.22c-.08-2.52-1.68-4.28-4-4.28A4.23,4.23,0,0,0,113.44,13Z");
    			attr(g0, "id", "Layer_1-2");
    			attr(g0, "data-name", "Layer 1");
    			attr(g1, "id", "Layer_2");
    			attr(g1, "data-name", "Layer 2");
    			set_svg_attributes(svg, svg_data);
    		},
    		m(target, anchor) {
    			insert(target, svg, anchor);
    			append(svg, defs);
    			append(svg, title);
    			append(title, t);
    			append(svg, g1);
    			append(g1, g0);
    			append(g0, path0);
    			append(g0, path1);
    			append(g0, path2);
    			append(g0, path3);
    			append(g0, path4);
    			append(g0, path5);
    			append(g0, path6);
    			append(g0, path7);
    		},
    		p(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 125.03 28.14" },
    				dirty & /*$$props*/ 1 && /*$$props*/ ctx[0]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(svg);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Logo extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
    	}
    }

    /* src\App.svelte generated by Svelte v3.31.0 */
    const file$5 = "src\\App.svelte";

    // (19:4) {#if mobile}
    function create_if_block$1(ctx) {
    	let hamburger;
    	let updating_open;
    	let current;

    	function hamburger_open_binding(value) {
    		/*hamburger_open_binding*/ ctx[4].call(null, value);
    	}

    	let hamburger_props = {};

    	if (/*open*/ ctx[1] !== void 0) {
    		hamburger_props.open = /*open*/ ctx[1];
    	}

    	hamburger = new Hamburger({ props: hamburger_props, $$inline: true });
    	binding_callbacks.push(() => bind(hamburger, "open", hamburger_open_binding));

    	const block = {
    		c: function create() {
    			create_component(hamburger.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburger, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hamburger_changes = {};

    			if (!updating_open && dirty & /*open*/ 2) {
    				updating_open = true;
    				hamburger_changes.open = /*open*/ ctx[1];
    				add_flush_callback(() => updating_open = false);
    			}

    			hamburger.$set(hamburger_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburger.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburger.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburger, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(19:4) {#if mobile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let header;
    	let logo;
    	let t0;
    	let div0;
    	let t1;
    	let header_resize_listener;
    	let t2;
    	let nav;
    	let sidebar;
    	let updating_open;
    	let t3;
    	let aside;
    	let t4;
    	let main;
    	let calculator;
    	let t5;
    	let footer;
    	let p;
    	let div1_resize_listener;
    	let current;

    	logo = new Logo({
    			props: {
    				width: "130px",
    				height: "40px",
    				fill: "var(--logo-color)"
    			},
    			$$inline: true
    		});

    	let if_block = /*mobile*/ ctx[3] && create_if_block$1(ctx);

    	function sidebar_open_binding(value) {
    		/*sidebar_open_binding*/ ctx[6].call(null, value);
    	}

    	let sidebar_props = { mobile: /*mobile*/ ctx[3] };

    	if (/*open*/ ctx[1] !== void 0) {
    		sidebar_props.open = /*open*/ ctx[1];
    	}

    	sidebar = new Sidebar({ props: sidebar_props, $$inline: true });
    	binding_callbacks.push(() => bind(sidebar, "open", sidebar_open_binding));
    	calculator = new Calculator({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			nav = element("nav");
    			create_component(sidebar.$$.fragment);
    			t3 = space();
    			aside = element("aside");
    			t4 = space();
    			main = element("main");
    			create_component(calculator.$$.fragment);
    			t5 = space();
    			footer = element("footer");
    			p = element("p");
    			p.textContent = "Made by Brian Latchman & Julian de Rushe, 2021";
    			attr_dev(div0, "class", "spacer svelte-1lomsxd");
    			add_location(div0, file$5, 17, 4, 529);
    			attr_dev(header, "class", "svelte-1lomsxd");
    			add_render_callback(() => /*header_elementresize_handler*/ ctx[5].call(header));
    			add_location(header, file$5, 15, 2, 415);
    			attr_dev(nav, "class", "svelte-1lomsxd");
    			add_location(nav, file$5, 22, 2, 628);
    			add_location(aside, file$5, 26, 2, 685);
    			attr_dev(main, "class", "svelte-1lomsxd");
    			add_location(main, file$5, 28, 2, 700);
    			add_location(p, file$5, 33, 4, 757);
    			attr_dev(footer, "class", "svelte-1lomsxd");
    			add_location(footer, file$5, 32, 2, 743);
    			attr_dev(div1, "class", "container svelte-1lomsxd");
    			set_style(div1, "--header-height", /*headerHeight*/ ctx[2] + "px");
    			add_render_callback(() => /*div1_elementresize_handler*/ ctx[7].call(div1));
    			toggle_class(div1, "open", /*open*/ ctx[1]);
    			add_location(div1, file$5, 10, 0, 292);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			mount_component(logo, header, null);
    			append_dev(header, t0);
    			append_dev(header, div0);
    			append_dev(header, t1);
    			if (if_block) if_block.m(header, null);
    			header_resize_listener = add_resize_listener(header, /*header_elementresize_handler*/ ctx[5].bind(header));
    			append_dev(div1, t2);
    			append_dev(div1, nav);
    			mount_component(sidebar, nav, null);
    			append_dev(div1, t3);
    			append_dev(div1, aside);
    			append_dev(div1, t4);
    			append_dev(div1, main);
    			mount_component(calculator, main, null);
    			append_dev(div1, t5);
    			append_dev(div1, footer);
    			append_dev(footer, p);
    			div1_resize_listener = add_resize_listener(div1, /*div1_elementresize_handler*/ ctx[7].bind(div1));
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*mobile*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mobile*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(header, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const sidebar_changes = {};
    			if (dirty & /*mobile*/ 8) sidebar_changes.mobile = /*mobile*/ ctx[3];

    			if (!updating_open && dirty & /*open*/ 2) {
    				updating_open = true;
    				sidebar_changes.open = /*open*/ ctx[1];
    				add_flush_callback(() => updating_open = false);
    			}

    			sidebar.$set(sidebar_changes);

    			if (!current || dirty & /*headerHeight*/ 4) {
    				set_style(div1, "--header-height", /*headerHeight*/ ctx[2] + "px");
    			}

    			if (dirty & /*open*/ 2) {
    				toggle_class(div1, "open", /*open*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(calculator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(calculator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(logo);
    			if (if_block) if_block.d();
    			header_resize_listener();
    			destroy_component(sidebar);
    			destroy_component(calculator);
    			div1_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let screenWidth = 0;
    	let open = false;
    	let headerHeight = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function hamburger_open_binding(value) {
    		open = value;
    		$$invalidate(1, open);
    	}

    	function header_elementresize_handler() {
    		headerHeight = this.clientHeight;
    		$$invalidate(2, headerHeight);
    	}

    	function sidebar_open_binding(value) {
    		open = value;
    		$$invalidate(1, open);
    	}

    	function div1_elementresize_handler() {
    		screenWidth = this.clientWidth;
    		$$invalidate(0, screenWidth);
    	}

    	$$self.$capture_state = () => ({
    		Calculator,
    		Hamburger,
    		Sidebar,
    		Logo,
    		screenWidth,
    		open,
    		headerHeight,
    		mobile
    	});

    	$$self.$inject_state = $$props => {
    		if ("screenWidth" in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ("open" in $$props) $$invalidate(1, open = $$props.open);
    		if ("headerHeight" in $$props) $$invalidate(2, headerHeight = $$props.headerHeight);
    		if ("mobile" in $$props) $$invalidate(3, mobile = $$props.mobile);
    	};

    	let mobile;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*screenWidth*/ 1) {
    			 $$invalidate(3, mobile = screenWidth < 768);
    		}
    	};

    	return [
    		screenWidth,
    		open,
    		headerHeight,
    		mobile,
    		hamburger_open_binding,
    		header_elementresize_handler,
    		sidebar_open_binding,
    		div1_elementresize_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
