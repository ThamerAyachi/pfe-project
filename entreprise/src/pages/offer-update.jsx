import { Helmet } from 'react-helmet-async';

import { UpdateOfferView } from 'src/sections/offers/views';

export default function OfferPage() {
  return (
    <>
      <Helmet>
        <title>Offer | Profi Link</title>
      </Helmet>

      <UpdateOfferView />
    </>
  );
}
