class LSet {
  constructor({ limit = 1500, oldest = 60000, every = 1000 } = {}) {
    this.every = every;
    this.oldest = oldest;
    this.limit = limit;
    this.list = [];
  }


  add(time) {
    let now = Date.now()
    let i;
    for (i = this.list.length; i > 0; i--) {
      if (this.list[i - 1] < now - this.oldest)
        break
    }

    this.list = this.list.slice(i)


    if (this.list.length >= this.limit) this.list.shift();
    this.list.push(time);
  }
}

module.exports = LSet
