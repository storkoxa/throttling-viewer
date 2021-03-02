class Throttling {
  constructor(requests, { name, per = 1000 } = {}) {
    this.requests = requests;

    this.result = [];
    this.name = name;
    this.per = per;

    this.update()
  }


  update(timer, options = {}) {
    setInterval(() => {
      this.calculate(options)
    }, this.requests.every);
  }


  calculate() {

    let len = Math.floor(this.requests.oldest / this.requests.every)
    let sublen = Math.floor(this.per / this.requests.every)

    let index = 0

    let response = new Array(len).fill(0);

    let now = Math.floor((Date.now() / 1000)) * 1000

    response = response.map((v, vi) => {
      let total = v;
      let beginTime = (now - this.requests.oldest) + (this.requests.every * vi)
      let endTime = beginTime + this.requests.every

      for (; index < this.requests.list.length; index++) {

        let current = this.requests.list[index]

        if (current >= beginTime) {
          if (current < endTime) {
            total++
          } else {
            break;
          }
        }
      }
      return total;
    })


    for (let i = response.length - 1; i > 0; i--) {
      let total = response[i]
      for (let j = 1; j < sublen; j++) {
        if (i - j >= 0)
          total += response[i - j]
      }
      response[i] = total
    }

    this.result = response
  }
}

module.exports = Throttling
