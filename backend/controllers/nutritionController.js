import { getFoodsPage, listFoods, searchFoods } from "../services/nutritionService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getFoods(req, res) {
  const data = await listFoods();
  return sendSuccess(res, { statusCode: 200, data });
}

export async function searchFoodList(req, res) {
  const data = await searchFoods(req.query.text);
  return sendSuccess(res, { statusCode: 200, data });
}

export async function getPagedFoods(req, res) {
  const { items, meta } = await getFoodsPage(req.query.page);
  return sendSuccess(res, { statusCode: 200, data: items, meta });
}
