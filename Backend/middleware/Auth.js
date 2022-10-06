import jwt from "jsonwebtoken";
import userModel from "../DB/model/User.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization.startsWith(process.env.bearerToken)) {
        res.json({ message: "in-valid Bearer token" });
      } else {
        const token = authorization.split(`${process.env.bearerToken}`)[1];
        const decoded = jwt.verify(token, process.env.tokensignature);
        if (!decoded || !decoded.id || !decoded.isLoggedIn) {
          res.json({ message: "in-valid payload" });
        } else {
          const user = await userModel
            .findOne({_id : decoded.id, deletedAt : true})
            .select("firstName lastName email isOnline ");
          if (!user) {
            res.json({ message: "in-valid token Id" });
          } else {
            if (!user.isOnline) {
              res.json({ message: "please signin first" });
            } else {
              req.authUser = user;
              next();
            }
          }
        }
      }
    } catch (error) {
      res.json({ message: "catch error", error });
    }
  };
};
