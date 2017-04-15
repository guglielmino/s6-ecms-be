import Rx from 'rxjs';

const INTERVAL_FREQ = 500;

function Node(value) {
  this.value = value;
  this.next = null;
}

function navigateList(predicate, action) {
  let head = this.first;
  let prev;
  while (head !== null) {
    if (predicate(head)) {
      action(head, prev);
    }
    prev = head;
    head = head.next;
  }
}

function DelayedQueue() {
  this.first = null;
  this.last = null;

  this.observable = new Rx.Subject();

  setInterval(() => {
    const now = new Date();
    navigateList.call(this,
      head => now.getTime() >= new Date(head.value.expire).getTime(),
      (head, prev) => {
        if (!prev) {
          this.first = this.first.next;
        } else {
          prev.next = head.next; // eslint-disable-line no-param-reassign
        }

        if (this.cb) {
          this.cb(head.value.item);
        }
      });
  }, INTERVAL_FREQ);
}

DelayedQueue.prototype.setCallback = function setCallback(cb) {
  this.cb = cb;
};

DelayedQueue.prototype.forEach = function forEach(fn) {
  navigateList.call(this,
    () => true,
    (head) => {
      fn(head.value.item);
    });
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

  navigateList.call(this,
    head => predicate(head.value.item),
    (head, prev) => {
      found = true;
      if (!prev) {
        this.first = this.first.next;
      } else {
        prev.next = head.next; // eslint-disable-line no-param-reassign
      }
    });

  return found;
};

DelayedQueue.prototype.isEmpty = function isEmpty() {
  return this.first === null;
};


DelayedQueue.prototype.getObservable = function getObservable() {
  return this.observable;
};

export default DelayedQueue;
