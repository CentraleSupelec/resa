// @flow

const { promisify } = require("util");
// src
const userParser = require("./utils/userParser");
const misc = require("./utils/misc");
const retryUntil = require("../utils/retryUntil");

/* ::
  import type { AnnuaireClient} from "./connect"
  import type { User, Event } from "../types.flow"
*/

async function getPersonFromEmail(
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  email /* : string */,
) /* : Promise<User | null> */ {
  const email_regex = /([a-zA-Z0-9]|-|\.|\+)+@([a-zA-Z0-9]|-)+\.[a-zA+Z]+/gm;

  if (email_regex.exec(email) === null) {
    throw new Error(`Variable email=${email} does not match email format`);
  }

  const response = await retryUntil(() =>
    promisify(annuaireClient.InterrogerAnnuaire)({
      guid,
      idAnnuaire: 2,
      requete: `SELECT p FROM OpenPortal.Noyau.PersonnePhysique p WHERE p.Login = "${email}"`,
      taillePage: 65535,
      numeroPage: 1,
    }),
  );

  const formattedResult = misc.readXML(response.InterrogerAnnuaireResult);
  const content = formattedResult.contenu;

  if (content !== undefined) {
    if (content.Utilisateur === undefined) {
      // could not find any user with this email in GEODE
      // Return null to handle this gracefully in the UI
      return null;
    }
    if (Array.isArray(content.Utilisateur) && content.Utilisateur.length > 1) {
      throw new Error(
        `${content.Utilisateur.length} users were found in GEODE with email ${email}, instead of only one`,
      );
    } else {
      return userParser(content);
    }
  } else {
    throw new Error(formattedResult);
  }
}

async function getPersonDetailsFromId(
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  userId /* : string */,
) {
  const response = await retryUntil(() =>
    promisify(annuaireClient.DetailPersonne)({
      guid,
      idPersonne: userId,
      typePersonne: 26,
      listeChamps: "Nom",
    }),
  );

  const user = misc.readXML(response.DetailPersonneResult);

  return userParser(user);
}

module.exports = {
  getPersonFromEmail,
  getPersonDetailsFromId,
};
