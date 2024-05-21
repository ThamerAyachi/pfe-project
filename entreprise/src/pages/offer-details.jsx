import { Helmet } from 'react-helmet-async';

import { DetailsOfferView } from 'src/sections/offers/views';

export default function DetailsOfferPage() {
  return (
    <>
      <Helmet>
        <title>Offer | Profi Link</title>
      </Helmet>

      <DetailsOfferView />
    </>
  );
}
