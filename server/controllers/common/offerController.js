const Offer = require("../../models/Offer");

exports.getOffers = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const results = await Offer.find()
      .populate("entreprise")
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalResults = await Offer.countDocuments();

    const totalPages = Math.ceil(totalResults / limit);

    res.json({
      results: results.map(({ _doc }) => ({
        ..._doc,
        entreprise: {
          ..._doc.entreprise._doc,
          photo: _doc.entreprise._doc.photo
            ? `${req.protocol}:\/\/${req.get("host")}/file/entreprise-profile/${
                _doc.entreprise._doc.photo
              }`
            : null,
        },
      })),
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in getOffers", error);
    return res
      .status(error.status ?? 400)
      .json({ error: error.message ?? "Error in get Offers" });
  }
};
