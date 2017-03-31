import Rx from 'rxjs';

const INTERVAL_FREQ = 500;

function Node(value) {
  this.value = value;
  this.next = null;
}

const navigateList = (first, predicate, action) => {
  let head = first;
  let prev;
  while (head !== null) {
    if (predicate(head)) {
      action(first, head, prev);
    }
    prev = head;
    head = head.next;
  }
};

function DelayedQueue() {
  this.first = null;
  this.last = null;

  this.observable = new Rx.Subject();

  this.intervalID = setInterval(() => {
    const now = new Date();
    let head = this.first;
    while (head != null) {
      if (head.value.expire >= now) {
        // rimuovo
        if (this.cb) {
          this.cb(head.value.item);
        }
      }
      head = head.next;
    }
  }, INTERVAL_FREQ);
}

DelayedQueue.prototype.setCallback = function (cb) {
  this.cb = cb;
};

DelayedQueue.prototype.add = function insert(item, delay) {
  const expire = new Date();
  expire.setMilliseconds(expire.getMilliseconds() + delay);

  const node = new Node({ item, expire });
  if (this.first === null) {
    this.last = node;
    this.first = this.last;
  } else {
    let head = this.first;
    while (head.next !== null) {
      head = head.next;
    }
    head.next = node;
    this.last = head.next;
  }
};

DelayedQueue.prototype.remove = function remove(predicate) {
  let found = false;

  const cb = this.cb;

  navigateList(this.first, head => predicate(head.value.item), (first, head, prev) => {
    found = true;
    if (!prev) {
      first = first.next;
    } else {
      prev.next = head.next;
    }

    // rimuovo
    if (cb) {
      cb(head.value.item);
    }
  });

  return found;
};

DelayedQueue.prototype.remove1 = function remove(predicate) {
  let found = false;
  let head = this.first;
  let prev;

  while (head !== null) {
    if (this.first && predicate(this.first.value.item)) {  // TODO: Comparision with predicate
      this.first = this.first.next;
      head = this.first;
      prev = head;
      found = true;
    } else {
      if (head && predicate(head.value.item)) {
        found = true;
        prev.next = head.next;
      }
      prev = head;
      head = head.next;
    }
  }

  return found;
};

DelayedQueue.prototype.isEmpty = function isEmpty() {
  return this.first === null;
};


DelayedQueue.prototype.getObservable = function getObservable() {
  return this.observable;
};

export default DelayedQueue;
