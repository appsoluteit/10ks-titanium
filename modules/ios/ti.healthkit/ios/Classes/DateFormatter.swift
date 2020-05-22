//
//  DateFormatter.swift
//  TiHealthkit
//
//  Created by Appcelerator Developer on 22/5/20.
//
// Source: https://www.raywenderlich.com/3418439-encoding-and-decoding-in-swift

import Foundation

extension DateFormatter {
  static let dateFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    return formatter
  }()
}
