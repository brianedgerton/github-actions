"use strict";

const leankitApiFactory = require( "../leankit/api" );
const { getInputParams, reportError, validateLeankitUrl } = require( "../leankit/helpers" );

function parseList( list ) {
	if ( !list ) {
		return [];
	}
	return list.trim().split( "\s*,\s" );
}

( async () => {
	const [
		host,
		apiToken,
		cardIds,
		assignUserIds,
		unassignUserIds,
		wipOverrideComment
	] = getInputParams( { required: [ "host", "apiToken", "cardIds" ], optional: [ "assignUserIds", "unassignUserIds", "wipOverrideComment" ] } );

	if (!assignUserIds && !unassignUserIds) {
		throw new Error( "Either assignUserIds or unassignUserIds must be specified" );
	}

	const cardIdList = parseList(cardIds);
	const userIdsToAssign = parseList(assignUserIds);
	const userIdsToUnassign = parseList(unassignUserIds);

	validateLeankitUrl( "host", host );

	const { assignCards } = leankitApiFactory( host, apiToken );

	await assignCards( cardIdList, userIdsToAssign, userIdsToUnassign, wipOverrideComment );
} )().catch( ex => {
	reportError( "moveCard", ex.message );
} );
