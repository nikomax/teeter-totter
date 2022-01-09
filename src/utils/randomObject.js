import {BEAM_LENGTH, MAX_WEIGHT, MIN_WEIGHT} from "@/utils/constants";

const randomNumber = (min, max) => {
	return Math.floor(Math.random() * max) + min;
}

export default () => {
	return {
		type: randomNumber(1, 3),
		weight: randomNumber(MIN_WEIGHT, MAX_WEIGHT),
		distance: randomNumber(1, BEAM_LENGTH/2)
	}
}
