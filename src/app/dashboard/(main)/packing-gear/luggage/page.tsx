import { getAllLuggage } from './_data/fetchers';
import { LuggageWrapper } from './page-wrapper';

export default async function LuggagePage() {
	const luggage = await getAllLuggage();

	return <LuggageWrapper luggage={luggage} />;
}
