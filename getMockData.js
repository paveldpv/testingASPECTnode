class GenMockData {
	#_amountData

	#_temp
	constructor(amountData) {
		this.#_amountData = amountData
		this.#_temp = 0
	}

	genMockData() {
		return Array(this.#_amountData)
			.fill({})
			.map((_, index) => {
				this.#_temp = index
				return {
					id: index,
					name: `name ${this.#_temp}`,
					description: `description ${this.#_temp}`,
				}
			})
	}
}

module.exports = GenMockData
