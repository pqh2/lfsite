'use strict';

angular.module('semdomtrans.comments', ['jsonRpc', 'ui.bootstrap', 'bellows.services',  'ngAnimate', 'palaso.ui.notice', 'semdomtrans.services', 'palaso.ui.sd.term', 'palaso.ui.scroll', 'palaso.ui.dc.comment', 'lexicon.services'])
// DBE controller
.controller('commentsCtrl', ['$scope', '$stateParams', 'lexCommentService',  'sessionService', 'modalService', 'silNoticeService', 
function($scope, $stateParams, commentService, sessionService, modal, notice) {
	var api = commentService;
	$scope.$parent.itemIndex = $stateParams.position;
	 $scope.control = $scope;
	$scope.newComment = {
		id: '',
		content: '',
		entryRef: '',
		regarding: {
			'field': '',
			'fieldValue': ''
		}
	}
	
	$scope.currentEntryCommentsFiltered = [];
	
	for (var i = 0; i < $scope.$parent.comments.length; i++) {
		if ($scope.currentItem.id == $scope.$parent.comments[i].entryRef["$id"]) {
			$scope.currentEntryCommentsFiltered.push($scope.$parent.comments[i]);
		}
	}
	

	$scope.setSelectedField = function setSelectedField(fieldName, model) {
		$scope.newComment.regarding.field = fieldName;
		$scope.newComment.regarding.fieldNameForDisplay = fieldName;
		$scope.newComment.regarding.fieldValue = model.source + "#" + model.source;	
	}
	
	$scope.createComment = function createComment() {
		$scope.newComment.entryRef = $scope.currentItem.id;	
		api.update($scope.newComment, function(result) {
			;
		});
	}
	
	// permissions stuff
	  $scope.rights = {
	    canEditProject: function canEditProject() {
	      return sessionService.hasProjectRight(sessionService.domain.PROJECTS, sessionService.operation.EDIT);
	    },
	    canEditEntry: function canEditEntry() {
	      return sessionService.hasProjectRight(sessionService.domain.ENTRIES, sessionService.operation.EDIT);
	    },
	    canDeleteEntry: function canDeleteEntry() {
	      return sessionService.hasProjectRight(sessionService.domain.ENTRIES, sessionService.operation.DELETE);
	    },
	    canComment: function canComment() {
	      return sessionService.hasProjectRight(sessionService.domain.COMMENTS, sessionService.operation.CREATE);
	    },
	    canDeleteComment: function canDeleteComment(commentAuthorId) {
	      if (sessionService.session.userId == commentAuthorId) {
	        return sessionService.hasProjectRight(sessionService.domain.COMMENTS, sessionService.operation.DELETE_OWN);
	      } else {
	        return sessionService.hasProjectRight(sessionService.domain.COMMENTS, sessionService.operation.DELETE);
	      }
	    },
	    canEditComment: function canEditComment(commentAuthorId) {
	      if (sessionService.session.userId == commentAuthorId) {
	        return sessionService.hasProjectRight(sessionService.domain.COMMENTS, sessionService.operation.EDIT_OWN);
	      } else {
	        return false;
	      }
	    },
	    canUpdateCommentStatus: function canUpdateCommentStatus() {
	      return sessionService.hasProjectRight(sessionService.domain.COMMENTS, sessionService.operation.EDIT);
	    }
	  };
}]);