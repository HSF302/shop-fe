//package com.office_dress_shop.shopbackend.exception;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//public class MyExceptionHandler {
//
//    @ExceptionHandler(AuthenticationException.class)
//    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
//        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
//    }
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<String> handleBadRequestException(MethodArgumentNotValidException exception){
//        System.out.println("Người dùng nhập chưa đúng thông tin");
//        StringBuilder responseMessage = new StringBuilder();
//        for(FieldError fieldError: exception.getFieldErrors()){
//            responseMessage.append(fieldError.getDefaultMessage()).append("\n");
//        }
//        return new ResponseEntity<>(responseMessage.toString(), HttpStatus.BAD_REQUEST);
//    }
//
//}
