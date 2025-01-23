import { getAllContainers } from './_data/fetchers';
import { ContainerWrapper } from './page-wrapper';

export default async function ContainersPage() {
	const containers = await getAllContainers();

	return <ContainerWrapper containers={containers} />;
}
